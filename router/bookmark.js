const Document = require("../model/document")
const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const verifyId = require("../middleware/verifyId");
const { getDocument } = require("./util/document");

const { findOneSpace } = require("./util/space");
const User = require("../model/user");

const router = express.Router();

router.get("/", auth, async (req, res) => {
	// #swagger.summary = Get bookmarks of the user.

	const userId = req.user._id;
	const user = await User.findOne({ _id: userId }).populate("bookmarks", Document)
	if (!user) return res.status(404).send({message:"User not found."});
	res.send(user.bookmarks)
})

router.post("/", auth, verifyId, async (req, res) => {
	// #swagger.summary = Add bookmarks to the user.
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

})

router.delete("/:bookmarkId", auth, verifyId, async (req, res) => {
	// #swagger.summary = Delete a bookmark from the user.
	const userId = req.user._id;
	const bookmarkId = req.params.bookmarkId;
	const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $pull: { bookmarks: bookmarkId }}, { new: true })
	res.send(updatedUser)
})

module.exports = router;