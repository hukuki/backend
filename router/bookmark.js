const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const verifyId = require("../middleware/verifyId");
const { getDocument } = require("./util/document");

const Bookmark = require("../model/bookmark");

const { findOneSpace } = require("./util/space");
const User = require("../model/user");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    // #swagger.summary = 'Gets all bookmarks of the user.'
    // #swagger.description = 'Bookmarks are documents saved by the user. Documents added to a space are not considered as bookmarks. This end point only returns the documents bookmarked by the user'

    const userId = req.user._id;

    const user = await User.findOne({ _id: userId }).populate("bookmarks")
    res.send(user.bookmarks)

});

router.post("/", auth, async (req, res) => {
    // #swagger.summary = 'Adds a new saved document.'
    /* #swagger.description = 'Saved documents are documents bookmarked by the user. Saving a document is different from adding a document to a space
    '
    */

    const documentId = req.body.document;
    const userId = req.user._id;

    if (!documentId) return res.status(400).send({ message: 'Invalid document.' });

    const user = await User.findOne({ _id: userId }).populate("bookmarks")
	const isAlreadyBookmarked = user.bookmarks.filter((b) => b === documentId)

    if (isAlreadyBookmarked.length > 0) {
        return res.send(user)
    }

    try {
		user.bookmarks.push(documentId)
		await user.save()
        res.send(user)
    } catch (e) {
        console.log(e)
        return res.status(400).send({ message: "Document object does not meet the schema description"})
    }
});

router.delete("/:id", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Deletes a bookmark.'
    // #swagger.description = '⚠️ Beware that this endpoint is not for changing the space which this `Bookmark` is in. Use `POST /spaces/:spaceId/bookmarks/:bookmarkId` endpoint for this. '

    const bookmark = await Bookmark.deleteMany({ _id: req.params.id, user: req.user._id } );

    if (!bookmark) return res.status(404).send({ message: 'Bookmark not found.' });

    res.send(bookmark);
});

module.exports = router;