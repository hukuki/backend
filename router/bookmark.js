const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const verifyId = require("../middleware/verifyId");

const Bookmark = require("../model/bookmark");
const Document = require("../model/document");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    const bookmarks = await Bookmark.find({ user: req.user._id });

    res.send(bookmarks);
});

router.post("/", auth, async (req, res) => {
    const documentId = req.body.document;

    if (!mongoose.isValidObjectId(documentId))
		return res.status(400).send({ message: "Invalid document id."});

    const document = await Document.findById(documentId);

    if (!document) return res.status(400).send({ message: 'Invalid document.' });

    try{
        const bookmark = await Bookmark.create({
            document: document._id,
            user: req.user._id
        });

        res.send(bookmark);
    }catch(e){
        return res.status(400).send({ message: "Bookmark doesn't match schema." });
    }
});

router.delete("/:id", auth, verifyId, async (req, res) => {
    const bookmark = await Bookmark.findOneAndDelete({_id: req.params.id, user: req.user._id});
    
    if (!bookmark) return res.status(404).send({ message: 'Bookmark not found.' });

    res.send();
});

module.exports = router;