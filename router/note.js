const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const verifyId = require("../middleware/verifyId");

const Note = require("../model/note");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    // #swagger.summary = 'Gets all notes of the user.'
    // #swagger.description = 'Notes are objects that contain a `from`and `to` values that determine what part of the document is higlighted. It can be used to represent a highlighted text without any note taken, but also a highlight with a note.'

    const notes = await Note.find({ user: req.user._id });

    res.send(notes);
});

router.post("/", auth, async (req, res) => {
    // #swagger.summary = 'Creates a new note.'
    /* #swagger.description = 'Notes are objects that contain a `from`and `to` values that determine what part of the document is higlighted. It can be used to represent a highlighted text without any note taken, but also a highlight with a note.
    <br>
    <ul>
    <li>You need to provide a document id in `document` field, which this `Note` is taken on.</li>
    <li>Also, `from` and `to` fields, which indicates start and end of the highlighted text.</li>
    <li>`content` is the actual note that user had written. It can be empty, since user may prefer to just highlight the text.</li>    
    </ul>
    ⚠️ Beware that notes when first created are created into the `Global Space`, which is the default space where every `Bookmark`and `Note`is located if user doesn't decide to change it.
    You can use `POST /spaces/:spaceId/notes/:noteId` endpoint to relocate this `Note` into another space.
    '
    */
   /*  #swagger.requestBody = {
            in: 'body',
            required: true,
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/PostNoteRequest' }
                }
            }
    } 
    */

    const documentId = req.body.document;

    if (!documentId) return res.status(400).send({ message: 'Invalid document.' });

    try{
        const note = await Note.create({
            document: documentId,
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
    // #swagger.summary = 'Updates a note.'
    // #swagger.description = '⚠️ Note that this endpoint is not for changing the space which this note is in. Use `POST /spaces/:spaceId/notes/:noteId` endpoint for this. '

    /*  #swagger.requestBody = {
            in: 'body',
            required: true,
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/PatchNoteRequest' }
                }
            }
    } 
    */
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
    // #swagger.summary = 'Deletes a note.'
    
    const note = await Note.findOneAndDelete({_id: req.params.id, user: req.user._id});
    
    if (!note) return res.status(404).send({ message: 'Note not found.' });

    res.send(note);
});

module.exports = router;