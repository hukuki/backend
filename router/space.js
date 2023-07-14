const Space = require("../model/space.js");
const User = require("../model/user.js")
const express = require("express");
const auth = require("../middleware/auth.js");
const verifyId = require("../middleware/verifyId.js");

const { findOneSpace, findSpaces } = require("./util/space.js");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    // #swagger.summary = 'Get all the spaces which the user created or added to.'
    // #swagger.description = 'Spaces are models that represent a project/folder, in which `Note`s and `Bookmark`s within are related to a certain case or project. This feature is useful since user can group different stuff.
    const user = req.user._id;
    const spaces = await Space.find({ "people.user":  user })
    .populate('people')
    .populate('createdBy')
    .populate("documents");
    res.send(spaces);
});

router.post("/", auth, async (req, res) => {
    // #swagger.summary = 'Create a new space.'

    if (!req.body.name || !req.body.description)
        return res.status(400).send({ message: "Space name and description is required." });

    const space = await Space.create({
        createdBy: req.user._id,
        name: req.body.name,
        description: req.body.description,
        people: [{ user: req.user._id, role: "manager"}]
    });

    await User.findOneAndUpdate({ _id: req.user._id}, { $push: { spaces: space._id} })

    res.send(space);
});

router.delete("/:spaceId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Delete a space.'
    // #swagger.description = 'Only people with the manager role can delete a space. The user created the space is assigned the manager role but further managers can change the role of the user who created the space'.

    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
    if (!space) {
        res.status(400).send({ message: "Only managers can delete a space"})
    }

    const deletedSpace = await Space.deleteOne({ _id: req.params.spaceId })
    await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { spaces: req.params.spaceId } })
    res.send(deletedSpace)
});

router.post("/:spaceId/users", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Add people to a space.'
    // #swagger.description = 'Only people with the manager role can add people to a space.'
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
    if (!space) {
        res.status(400).send({ message: "Only managers can add people to a space"})
    }
    const peopleToAdd = req.body.people;
    const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $push: { people: { $each: peopleToAdd }} })
    await User.updateMany({ '_id': { $in: peopleToAdd } }, { $push: { spaces: req.params.spaceId }} )
    res.send(updatedSpace)
})

router.put("/:spaceId/users/:userId", auth, verifyId, async(req, res) => {
    // #swagger.summary = 'Change roles of people in a space.'
    // #swagger.description = 'Only people with the manager role can change roles in a space.'
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
    if (!space) {
        res.status(400).send({ message: "Only managers can change roles in a space"})
    }
    const documentsToAdd = req.body.documents;
    const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $push: { documents: { $each: documentsToAdd }} })
    res.send(updatedSpace)
})

router.post("/:spaceId/documents", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Add documents to a space.'
    // #swagger.description = 'Only people with the manager or editor roles can add documents to a space.'
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": { $in: ["manager", "editor"]}});
    if (!space) {
        res.status(400).send({ message: "Only managers and editors can add documents to a space"})
    }
    const documentsToAdd = req.body.documents;
    const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $push: { documents: { $each: documentsToAdd }} })
    res.send(updatedSpace)
})

router.delete("/:spaceId/users/:userId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Delete a person from a space.'
    // #swagger.description = 'Only people with the manager role can delete a person from a space.'.
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
    if (!space) {
        res.status(400).send({ message: "Only managers can delete a space"})
    }

    const deletedUserId = req.params.userId;
    const userId = req.user._id;

    const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $pull: { people: deletedUserId } })
    await User.findOneAndUpdate({ _id: deletedUserId }, { $pull: { spaces: deletedUserId }})
    res.send(updatedSpace)
})

router.delete("/:spaceId/users/:documentId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Delete a document from a space.'
    // #swagger.description = 'Only people with the manager and editor roles can delete a document from a space.'.
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": { $in: ["manager", "editor"]}});
    if (!space) {
        res.status(400).send({ message: "Only managers and editors can delete a document from a space"})
    }

    const documentId = req.params.documentId;
    const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $pull: { documents: documentId } })
    res.send(updatedSpace)
})

/*
router.get("/:spaceId/notes", auth, async (req, res) => {
    // #swagger.summary = 'Get all the notes in a space.'

    const space = await findOneSpace({ space: req.params.spaceId, user: req.user._id });


    if (!space) return res.status(404).send({ message: "Space not found." });

    console.log(space);

    const notes = await Note.find({ space: space._id }).populate('user');

    res.send(notes);
});
*/

router.get("/:spaceId/users", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Get the people in a space'

    // Get the space which user created or has been added to
    const space = await Space.findOne({ _id: req.params.spaceId}).populate("people")

    if (!space) return res.status(404).send({ message: "Space not found "})

    const user = req.user._id

    if (!space.people.get(user)) {
        return res.status(401).send({ message: "Unauthorized"})
    }

    res.send(space.people)

})

/*
router.post("/:spaceId/users", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Add a list of people to a space'

    if (!req.body.people || req.body.people.length === 0) {
        return res.status(400).send({ message: "People in body cannot be empty "})
    }

    const users = await User.find({ _id: { $in: req.body.people }})
    const userIds = users.map((user) => user._id)

    const space = await Space.findOne({ _id: req.params.spaceId, user: req.user._id }).populate("people").populate("user")

    if (!space) res.status(404).send({ message: "Space not found "})

    const userIdsInSpace = space.people.map((person) => person._id)


})

router.post("/:spaceId/users/:userId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Add a collegue to a space.'

    const user = await User.findOne({ _id: req.params.userId, organization: req.user.organization });

    // Here, we don't use the helper findOneSpace, because only the owner of the space
    // can add a user to the space.

    const space = await Space.findOne({ _id: req.params.spaceId, user: req.user._id })
        .populate('people')
        .populate('user');

    if (!space) return res.status(404).send({ message: "Space not found." });

    space.people = space.people.filter((item) => {
        console.log(item);
        return item._id != user._id;
    });

    space.people.pull({ _id: user._id });
    space.people.push(user);

    await space.save();

    res.send(space);
});

router.delete("/:spaceId/users/:userId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Delete a collegue from the space.'

    const user = await User.findOne({ _id: req.params.userId, organization: req.user.organization });

    // Here, we don't use the helper findOneSpace,
    // because only the owner can delete an user from the space.

    const space = await Space.findOne({ _id: req.params.spaceId, user: req.user._id })
        .populate('people')
        .populate('user');

    if (!space) return res.status(404).send({ message: "Space not found." });

    space.people.pull({ _id: user._id });
    await space.save();

    res.send(space);
});

router.get("/:spaceId/bookmarks", auth, async (req, res) => {
    // #swagger.summary = 'Get all the bookmarks in a space.'

    const space = await findOneSpace({ space: req.params.spaceId, user: req.user._id });

    if (!space) return res.status(404).send({ message: "Space not found." });

    const bookmarks = await Bookmark.find({ space: space._id }).populate('user');;

    res.send(bookmarks);
});

*/
module.exports = router;