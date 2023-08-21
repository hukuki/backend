const Space = require("../model/space.js");
const User = require("../model/user.js")
const express = require("express");
const auth = require("../middleware/auth.js");
const verifyId = require("../middleware/verifyId.js");

const router = express.Router();
const createSpaceValidator = require("./util/createSpaceValidator.js")
const addPeopleToSpaceValidator = require("./util/addPeopleToSpaceValidator.js")
const addDocumentToSpaceValidator = require("./util/addDocumentToSpaceValidator.js")
const changeRoleInSpaceValidator = require("./util/changeRoleInSpaceValidator.js")
// GET OPERATIONS:
router.get("/", auth, async (req, res) => {
	// #swagger.summary = Get spaces of the user.
	const userId = req.user._id;
	const user = await User.findOne({ _id: userId }).populate("spaces")
	if (!user) return res.status(404).send({message:"User not found."});
	res.send(user.spaces)
})


router.get("/:spaceId/users", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Get the people in a space'
    // #swagger.description = 'Only people in a space can see the documents saved in that space'
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id})
    if (!space) {
        return res.status(404).send({ message: "Space not found"})
    }
    res.send(space.people)

})

router.get("/:spaceId/documents", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Get the documents in a space'
    // #swagger.description = 'Only people in a space can see the documents saved in that space'
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id}).populate("documents")
    if (!space) return res.status(404).send({ message: "Space not found "})
    res.send(space.documents)

})


// POST OPERATIONS
router.post("/", auth, createSpaceValidator, async (req, res, next) => {
	// #swagger.summary = Create a new space.
	const userId = req.user._id;
    try {
        const newSpace = await Space.create({
            createdBy: userId,
            name: req.body.name,
            description: req.body.description,
            people: [{ user: userId, role: "manager"}],
            documents: []
        })
        await User.findOneAndUpdate({ _id: userId}, { $push: { spaces: newSpace._id }}, { new: true})
        res.send(newSpace)
    } catch (err) {
        next(err)
    }
})

router.post("/:spaceId/users", auth, verifyId, addPeopleToSpaceValidator, async (req, res, next) => {
    // #swagger.summary = 'Add people to a space.'
    // #swagger.description = 'Only people with the manager role can add people to a space. Body expects an array of user ID's and assigned user roles'
    const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
    if (!space) {
        return res.status(400).send({ message: "Only managers can add people to a space"})
    }
    const peopleToAdd = req.body.people;
    const oldPeopleIds = space.people.map((p) => p.user)
    const newPeopleToAdd = peopleToAdd.filter((p) => {
        if (oldPeopleIds.includes(p.user)) {
            return false
        }
        return true
    })
    if (newPeopleToAdd.length === 0) {
        res.send(space)
    } else {
        try {
            const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $push: { people: { $each: newPeopleToAdd }} }, { new: true })
            const newPeopleIds = newPeopleToAdd.map((p) => p.user)
            await User.updateMany({ '_id': { $in: newPeopleIds } }, { $push: { spaces: req.params.spaceId }} )
            res.send(updatedSpace)
        } catch (err) {
            next(err)
        }
    }

})

router.post("/:spaceId/documents", auth, verifyId, addDocumentToSpaceValidator, async (req, res, next) => {
    // #swagger.summary = 'Add documents to a space.'
    // #swagger.description = 'Only people with the manager or editor roles can add documents to a space.'
    try {
        const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": { $in: ["manager", "editor"]}});
        if (!space) {
            return res.status(400).send({ message: "Only managers and editors can add documents to a space"})
        }
        const documents = req.body.documents.map((d) => {
            return {
                addedBy: req.user._id,
                document: d,
            }
        })
        const oldDocuments = space.documents.map((d) => d.document.toString())
        const newDocuments = documents.filter((d) => {
            if (oldDocuments.includes(d.document)) {
                return false
            }
            return true
        })
        const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $push: { documents: newDocuments }}, { new: true })
        res.send(updatedSpace)
    } catch (err) {
        next(err)
    }
})

//PUT OPERATIONS:
router.put("/:spaceId/users/:userId", auth, verifyId, changeRoleInSpaceValidator, async(req, res, next) => {
    // #swagger.summary = 'Change roles of a person in a space.'
    // #swagger.description = 'Only people with the manager role can change roles in a space.'
    try {
        const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
        if (!space) {
            return res.status(400).send({ message: "Only managers can change roles in a space"})
        }
        const newRole = req.body.role;
        if (newRole !== "observer" && newRole !== "manager" && newRole !== "editor") {
            return res.status(400).send({ message: "Role not acceptable. "})
        }
        const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId, "people.user": req.params.userId }, { $set: { "people.$.role": newRole }}, { new: true })
        res.send(updatedSpace)
    } catch (err) {
        next(err)
    }
})

//DELETE OPERATIONS:
router.delete("/:spaceId", auth, verifyId, async (req, res, next) => {
    // #swagger.summary = 'Delete a space.'
    // #swagger.description = 'Only people with the manager role can delete a space. The user created the space is assigned the manager role but further managers can change the role of the user who created the space'.
    try {
        const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
        if (!space) {
            return res.status(400).send({ message: "Only managers can delete a space"})
        }

        const deletedSpace = await Space.deleteOne({ _id: req.params.spaceId })
        const users = space.people.map((p) => p.user)
        await User.updateMany({ '_id': { $in: users } }, { $pull: { spaces: req.params.spaceId }} )
        
        res.send(deletedSpace)
    } catch (err) {
        next(err)
    }
});

router.delete("/:spaceId/users/:userId", auth, verifyId, async (req, res, next) => {
    // #swagger.summary = 'Delete a person from a space.'
    // #swagger.description = 'Only people with the manager role can delete a person from a space.'.
    try {
        const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": "manager"});
        if (!space) {
            return res.status(400).send({ message: "Only managers can delete a space"})
        }

        const deletedUserId = req.params.userId;
        const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $pull: { people: deletedUserId } })
        await User.findOneAndUpdate({ _id: deletedUserId }, { $pull: { spaces: deletedUserId }}, { new: true})
        res.send(updatedSpace)
    } catch (err) {
        next(err)
    }
})

router.delete("/:spaceId/documents/:documentId", auth, verifyId, async (req, res, next) => {
    // #swagger.summary = 'Delete a document from a space.'
    // #swagger.description = 'Only people with the manager and editor roles can delete a document from a space.'.
    try {
        const space = await Space.findOne({ _id: req.params.spaceId, "people.user": req.user._id, "people.role": { $in: ["manager", "editor"]}});
        if (!space) {
            return res.status(400).send({ message: "Only managers and editors can delete a document from a space"})
        }

        const documentId = req.params.documentId;
        const updatedSpace = await Space.findOneAndUpdate({ _id: req.params.spaceId }, { $pull: { documents: { document: documentId } } }, { new: true })
        res.send(updatedSpace)
    } catch (err) {
        next(err)
    }
})


module.exports = router;