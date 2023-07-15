const Space = require("../model/space.js");
const User = require("../model/user.js")
const express = require("express");
const auth = require("../middleware/auth.js");
const verifyId = require("../middleware/verifyId.js");

const { findOneSpace, findSpaces } = require("./util/space.js");

const router = express.Router();

// GET OPERATIONS:
router.get("/", auth, async (req, res) => {
    // #swagger.summary = 'Get all the spaces which the user created or added to.'
    // #swagger.description = 'Spaces are models that represent a project/folder, in which `Note`s and `Bookmark`s within are related to a certain case or project. This feature is useful since user can group different stuff.
    const user = req.user._id;
    const spaces = await Space.find({ "people.user":  user }).populate('createdBy')
    res.send(spaces);
});


router.get("/:spaceId/users", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Get the people in a space'
    // #swagger.description = 'Only people in a space can see the documents saved in that space'
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id})
    res.send(space.people)

})

router.get("/:spaceId/documents", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Get the documents in a space'
    // #swagger.description = 'Only people in a space can see the documents saved in that space'
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id})
    if (!space) return res.status(404).send({ message: "Space not found "})
    res.send(space.documents)

})


// POST OPERATIONS
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

router.post("/:spaceId/users", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Add people to a space.'
    // #swagger.description = 'Only people with the manager role can add people to a space.'
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
    if (!space) {
        return res.status(400).send({ message: "Only managers can add people to a space"})
    }
    const peopleToAdd = req.body.people;
    const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $push: { people: { $each: peopleToAdd }} })
    await User.updateMany({ '_id': { $in: peopleToAdd } }, { $push: { spaces: req.params.spaceId }} )
    res.send(updatedSpace)
})

router.post("/:spaceId/documents", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Add documents to a space.'
    // #swagger.description = 'Only people with the manager or editor roles can add documents to a space.'
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": { $in: ["manager", "editor"]}});
    if (!space) {
        return res.status(400).send({ message: "Only managers and editors can add documents to a space"})
    }
    const documentsToAdd = req.body.documents;
    await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $push: { documents: documentsToAdd }})
    res.send(updatedSpace)
})

//PUT OPERATIONS:
router.put("/:spaceId/users/:userId", auth, verifyId, async(req, res) => {
    // #swagger.summary = 'Change roles of a person in a space.'
    // #swagger.description = 'Only people with the manager role can change roles in a space.'
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
    if (!space) {
        return res.status(400).send({ message: "Only managers can change roles in a space"})
    }
    const newRole = req.body.role;
    if (newRole !== "observer" || newRole !== "manager" || newRole !== "editor") {
        return res.status(400).send({ message: "Role not acceptable. "})
    }
    const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId, "people.user": req.params.userId }, { $set: { "people.$.role": newRole }})
    res.send(updatedSpace)
})

//DELETE OPERATIONS:

router.delete("/:spaceId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Delete a space.'
    // #swagger.description = 'Only people with the manager role can delete a space. The user created the space is assigned the manager role but further managers can change the role of the user who created the space'.

    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
    if (!space) {
        return res.status(400).send({ message: "Only managers can delete a space"})
    }

    const deletedSpace = await Space.deleteOne({ _id: req.params.spaceId })
    const users = space.people.map((p) => p.user)
    await User.updateMany({ '_id': { $in: users } }, { $pull: { spaces: req.params.spaceId }} )
    res.send(deletedSpace)
});

router.delete("/:spaceId/users/:userId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Delete a person from a space.'
    // #swagger.description = 'Only people with the manager role can delete a person from a space.'.
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
    if (!space) {
        return res.status(400).send({ message: "Only managers can delete a space"})
    }

    const deletedUserId = req.params.userId;
    const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $pull: { people: deletedUserId } })
    await User.findOneAndUpdate({ _id: deletedUserId }, { $pull: { spaces: deletedUserId }})
    res.send(updatedSpace)
})

router.delete("/:spaceId/users/:documentId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Delete a document from a space.'
    // #swagger.description = 'Only people with the manager and editor roles can delete a document from a space.'.
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": { $in: ["manager", "editor"]}});
    if (!space) {
        return res.status(400).send({ message: "Only managers and editors can delete a document from a space"})
    }

    const documentId = req.params.documentId;
    const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $pull: { documents: documentId } })
    res.send(updatedSpace)
})


module.exports = router;