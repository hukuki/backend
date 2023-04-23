const express = require("express");
const Space = require("../model/space.js");
const Note = require("../model/note.js");
const Bookmark = require("../model/bookmark.js");
const auth = require("../middleware/auth.js");
const verifyId = require("../middleware/verifyId.js");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    // #swagger.summary = 'Get all the spaces created by the user.'
    // #swagger.description = 'Spaces are models that represent a project/folder, in which `Note`s and `Bookmark`s within are related to a certain case or project. This feature is useful since user can group different stuff.
    const spaces = await Space.find({ user: req.user._id });

    res.send(spaces);
});

router.post("/", auth, async (req, res) => {
    // #swagger.summary = 'Create a new space.'
    
    if (!req.body.name)
        return res.status(400).send({ message: "Space name is required." });

    const space = await Space.create({
        user: req.user._id,
        name: req.body.name
    });

    res.send(space);
});

router.delete("/:spaceId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Delete a space.'

    const space = await Space.findOneAndDelete({ _id: req.params.spaceId, user: req.user._id });

    if (!space) return res.status(404).send({ message: "Space not found." });

    await Note.updateMany({ user: req.user._id, space: space._id }, { space: null });

    res.send();
});

router.post("/:spaceId/notes/:noteId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Move a note to a space.'

    /* #swagger.description = 'When a `Note` is first created, it is located in user\'s `Global Space`. After user creates `Space`s, they can move their notes to these different spaces.
    
    </br>
    </br>
    ⚠️ To move a `Note` back to the user\'s `Global Space`, you need to provide the user\'s id instead of space id, in the `spaceId` field.' 
    */
    
    if (req.user._id.equals(req.params.spaceId)) {
        await Note.updateOne({ _id: req.params.noteId, user: req.user._id }, { space: null });
    } else {
        const space = await Space.findOne({ _id: req.params.spaceId, user: req.user._id });

        if (!space) return res.status(404).send({ message: "Space not found." });

        await Note.updateOne({ _id: req.params.noteId, user: req.user._id }, { space: space._id });
    }

    res.send();
});

router.get("/:spaceId/notes", auth, async (req, res) => {
    // #swagger.summary = 'Get all the notes in a space.'

    const space = await Space.findOne({ _id: req.params.spaceId, user: req.user._id });

    const notes = await Note.find({ user: req.user._id, space: space._id });

    res.send(notes);
});

router.post("/:spaceId/bookmarks/:bookmarkId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Move a bookmark to a space.'
    
      /* #swagger.description = '
    When a `Bookmark` is first created, it is located in user\'s `Global Space`. After user creates `Space`s, they can move their bookmarks to these different spaces.
    </br>
    </br>
    ⚠️ To move a `Bookmark` back to the user\'s `Global Space`, you need to provide the user\'s id instead of space id, in the `spaceId` field.' 
    */

    if (req.user._id.equals(req.params.spaceId)) {
        await Bookmark.updateOne({ _id: req.params.bookmarkId, user: req.user._id }, { space: null });
    } else {
        const space = await Space.findOne({ _id: req.params.spaceId, user: req.user._id });

        if (!space) return res.status(404).send({ message: "Space not found." });

        await Bookmark.updateOne({ _id: req.params.bookmarkId, user: req.user._id }, { space: space._id });
    }

    res.send();
});

router.get("/:spaceId/bookmarks", auth, async (req, res) => {
    // #swagger.summary = 'Get all the bookmarks in a space.'
    
    const space = await Space.findOne({ _id: req.params.spaceId, user: req.user._id });

    const bookmarks = await Bookmark.find({ user: req.user._id, space: space._id });
    
    res.send(bookmarks);
});


module.exports = router;