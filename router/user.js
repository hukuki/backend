const User = require("../model/user");
const Document = require("../model/document")
const Space = require("../model/space");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const verifyId = require("../middleware/verifyId");
const router = express.Router();

// Path: backend/router/user.js

// GET OPERATIONS
router.get("/", auth, async (req, res) => {
	// #swagger.summary = Get all the collegues of the user.

	const organization = req.user.organization;

	const users = await User.find({ organization: organization }).populate("bookmarks", Document).populate("spaces", Space);

	res.send(users);
});

router.get("/:id", auth, verifyId, async (req, res) => {
	// #swagger.summary = Get a certain collegue of the user.

	const userId = req.params.id;
	const organization = req.user.organization;

	const user = await User.findOne({ _id: userId, organization }).populate("bookmarks", Document).populate("spaces", Space);

	if (!user) return res.status(404).send({message:"User not found."});

	res.send(user);
});

router.get("/bookmarks", auth, verifyId, async (req, res) => {
	// #swagger.summary = Get bookmarks of the user.

	const userId = req.user._id;
	const user = await User.findOne({ _id: userId }).populate("bookmarks", Document)
	if (!user) return res.status(404).send({message:"User not found."});
	res.send(user.bookmarks)
})

router.get("/spaces", auth, verifyId, async (req, res) => {
	// #swagger.summary = Get spaces of the user.
	const userId = req.user._id;
	const user = await User.findOne({ _id: userId }).populate("spaces", Space)
	if (!user) return res.status(404).send({message:"User not found."});
	res.send(user.spaces)
})

// POST OPERATIONS:
router.post("/bookmarks", auth, verifyId, async (req, res) => {
	// #swagger.summary = Add bookmarks to the user.
	const userId = req.user._id;
	const user = await User.findOne({ _id: userId })
	if (!user) return res.status(404).send({message:"User not found."});
	const bookmarks = req.body.bookmarks;
	const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, { $push: { bookmarks: bookmarks }})
	res.send(updatedUser)
})

router.post("/spaces", auth, verifyId, async (req, res) => {
	// #swagger.summary = Add spaces to the user.
	const userId = req.user._id;
	const user = await User.findOne({ _id: userId })
	if (!user) return res.status(404).send({message:"User not found."});
	const spaces = req.body.spaces;
	const updatedUser = User.findOneAndUpdate({ _id: userId }, { $push: { spaces: spaces }})
	await Space.updateMany({ "_id": { $in: spaces }}, { $push: { people: userId}})
	res.send(updatedUser)
})

// DELETE OPERATIONS:
router.delete("/bookmarks/:bookmarkId", auth, verifyId, async (req, res) => {
	// #swagger.summary = Delete a bookmark from the user.
	const userId = req.user._id;
	const user = await User.findOne({ _id: userId })
	if (!user) return res.status(404).send({message:"User not found."});
	const bookmarkId = req.params.bookmarkId;
	const updatedUser = User.findOneAndUpdate({ _id: userId }, { $pull: { bookmarks: bookmarkId }})
	res.send(updatedUser)
})

router.delete("/spaces/:spaceId", auth, verifyId, async (req, res) => {
	// #swagger.summary = Delete a space from the user.
	const userId = req.user._id;
	const user = await User.findOne({ _id: userId })
	if (!user) return res.status(404).send({message:"User not found."});
	const spaceId = req.params.spaceId;
	const updatedUser = User.findOneAndUpdate({ _id: userId }, { $pull: { spaces: spaceId }})
	await Space.updateMany({ "people.user": userId }, { $pull: { people: userId }})
	res.send(updatedUser)
})

router.delete("/:id", [auth, admin], verifyId, async (req, res) => {
	// #swagger.summary = Delete a certain collegue account. Needs domain-admin access.

	const userId = req.params.id;
	const organization = req.user.organization;

	if(userId == req.user._id) return res.status(400).send({message: "You cannot delete yourself."});

	const user = await User.findOneAndDelete({_id: userId, organization});

	if (!user) return res.status(404).send({message:"User not found."});

	await Space.updateMany({ "people.user" : userId }, { $pull: { people: userId }})

	res.send(user);
});

module.exports = router;
