const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const User = require("../model/user");
const verifyId = require("../middleware/verifyId");

const router = express.Router();

// Path: backend/router/user.js
router.get("/", auth, async (req, res) => {
	// #swagger.summary = Get all the collegues of the user.

	const organization = req.user.organization;

	const users = await User.find({ organization: organization });

	res.send(users);
});

router.get("/:id", auth, verifyId, async (req, res) => {
	// #swagger.summary = Get a certain collegue of the user.

	const userId = req.params.id;
	const organization = req.user.organization;
	
	const user = await User.findOne({ _id: userId, organization });

	if (!user) return res.status(404).send({message:"User not found."});
 
	res.send(user);
});

router.delete("/:id", [auth, admin], verifyId, async (req, res) => {
	// #swagger.summary = Delete a certain collegue account. Needs domain-admin access.

	const userId = req.params.id;
	const organization = req.user.organization;

	if(userId === req.user._id) return res.status(400).send({message: "You cannot delete yourself."});

	const {deletedCount} = await User.deleteOne({_id: userId, organization});

	if (deletedCount == 0) return res.status(404).send({message:"User not found."});

	res.send();
});

module.exports = router;
