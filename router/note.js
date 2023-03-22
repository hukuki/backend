const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const verifyId = require("../middleware/verifyId");

const Note = require("../model/note");
const Document = require("../model/document");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    const notes = await Note.find({ user: req.user._id });

    res.send(notes);
});

router.post("/", auth, async (req, res) => {
    const documentId = req.body.document;

    if (!mongoose.isValidObjectId(documentId))
		return res.status(400).send({ message: "Invalid document id."});

    const document = await Document.findById(documentId);

    if (!document) return res.status(400).send({ message: 'Invalid document.' });

    try{
        const note = await Note.create({
            document: document._id,
            user: req.user._id,
            content: req.body.content,
            from: req.body.from,
            to: req.body.to
        });

        res.send(note);
    }catch(e){
        return res.status(400).send({ message: "Note doesn't match schema." });
    }
});

router.patch("/:id", auth, verifyId, async (req, res) => {
    const note = await Note.findOneAndUpdate({
        _id: req.params.id,
        user: req.user._id
    }, {
        content: req.body.content,
        from: req.body.from,
        to: req.body.to
    });

    if (!note) return res.status(404).send({ message: 'Note not found.' });

    res.send();
});

router.delete("/:id", auth, verifyId, async (req, res) => {
    const note = await Note.findOneAndDelete({_id: req.params.id, user: req.user._id});
    
    if (!note) return res.status(404).send({ message: 'Note not found.' });

    res.send();
});

module.exports = router;