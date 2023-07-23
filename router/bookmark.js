const Document = require("../model/document")
const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const verifyId = require("../middleware/verifyId");
const { getDocument } = require("./util/document");

const { findOneSpace } = require("./util/space");
const User = require("../model/user");

const router = express.Router();

const addBookmarkValidator = require("./util/addBookmarkValidator")

router.get("/", auth, async (req, res) => {
	// #swagger.summary = Get bookmarks of the user.
	try {
		const userId = req.user._id;
		const user = await User.findOne({ _id: userId }).populate("bookmarks")
		if (!user) return res.status(404).send({message:"User not found."});
		res.send(user.bookmarks)
	} catch (err) {
		next(err)
	}
})

router.post("/", auth, verifyId, addBookmarkValidator, async (req, res, next) => {
	// #swagger.summary = Add bookmarks to the user.
	try {
		const userId = req.user._id;
		const user = await User.findOne({ _id: userId })
		if (!user) return res.status(404).send({message:"User not found."});
		const bookmarks = req.body.bookmarks;
		const newBookmarks = bookmarks.filter((b) => {
			if (user.bookmarks.includes(b)) {
				return false;
			}
			return true;
		})
		if (newBookmarks.length === 0) {
			res.send(user)
		} else {
			const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, { $push: { bookmarks: newBookmarks }}, { new: true})
			res.send(updatedUser)
		}
	} catch (err) {
		next(err)
	}
})

router.delete("/:bookmarkId", auth, verifyId, async (req, res) => {
	// #swagger.summary = Delete a bookmark from the user.
	const userId = req.user._id;
	const bookmarkId = req.params.bookmarkId;
	const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $pull: { bookmarks: bookmarkId }}, { new: true })
	res.send(updatedUser)
})

module.exports = router;