const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const verifyId = require("../middleware/verifyId");

const Bookmark = require("../model/bookmark");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    // #swagger.summary = 'Gets all bookmarks of the user.'
    // #swagger.description = 'Bookmarks are objects which will allow users to bookmark ceration documents, so that they can keep track of their work. Multiple bookmarks for a single document may be created, because each of these bookmarks may belong to different `Space`s.'

    const bookmarks = await Bookmark.find({ user: req.user._id });

    res.send(bookmarks);
});

router.post("/", auth, async (req, res) => {
    // #swagger.summary = 'Creates a new bookmark.'
    /* #swagger.description = 'Bookmarks are objects which will allow users to bookmark ceration documents, so that they can keep track of their work. Multiple bookmarks for a single document may be created, because each of these bookmarks may belong to different `Space`s. 
    </br>
    </br>
    ⚠️ Beware that bookmarks when first created are created into the `Global Space`, which is the default space where every `Bookmark`and `Note`is located if user doesn't decide to change it.
    You can use `POST /spaces/:spaceId/bookmarks/:bookmarkId` endpoint to relocate this `Bookmark` into another space.
    '
    */

    const documentId = req.body.document;


    if (!documentId) return res.status(400).send({ message: 'Invalid document.' });

    try{
        const bookmark = await Bookmark.create({
            document: documentId,
            user: req.user._id
        });

        res.send(bookmark);
    }catch(e){
        return res.status(400).send({ message: "Bookmark doesn't match schema." });
    }
});

router.delete("/:id", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Deletes a bookmark.'
    // #swagger.description = '⚠️ Beware that this endpoint is not for changing the space which this `Bookmark` is in. Use `POST /spaces/:spaceId/bookmarks/:bookmarkId` endpoint for this. '

    const bookmark = await Bookmark.findOneAndDelete({_id: req.params.id, user: req.user._id});
    
    if (!bookmark) return res.status(404).send({ message: 'Bookmark not found.' });

    res.send(bookmark);
});

module.exports = router;