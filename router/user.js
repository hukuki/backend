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

	const users = await User.find({ organization: organization }).populate("bookmarks").populate("spaces");

	res.send(users);
});

router.get("/:id", auth, verifyId, async (req, res) => {
	// #swagger.summary = Get a certain collegue of the user.

	const userId = req.params.id;
	const organization = req.user.organization;

	const user = await User.findOne({ _id: userId, organization }).populate("bookmarks").populate("spaces");

	if (!user) return res.status(404).send({message:"User not found."});

	res.send(user);
});



// DELETE OPERATIONS:




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
