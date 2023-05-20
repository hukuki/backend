const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const verifyId = require("../middleware/verifyId");
const { getDocument } = require("./util/document");

const Bookmark = require("../model/bookmark");

const { findOneSpace } = require("./util/space");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    // #swagger.summary = 'Gets all bookmarks of the user in Global Space.'
    // #swagger.description = 'Bookmarks are objects which will allow users to bookmark ceration documents, so that they can keep track of their work. Multiple bookmarks for a single document may be created, because each of these bookmarks may belong to different `Space`s.</br></br> ⚠️ This endpoint will return all the bookmarks of the user which do not belong to any `Space`s, just the ones in user's `Global Space`.'

    const document = req.query.document;
    const search = { user: req.user._id, space: null };

    if (document)
        search.document = document;
        
    const bookmarks = await Bookmark.find(search);

    let bookmarksObjects = bookmarks.map(bookmark => bookmark.toJSON());
    
    const results = [];
    for(let bookmark of bookmarksObjects){
        try{
            bookmark.document = await getDocument(bookmark.document);

            if(!bookmark.document){
                await Bookmark.deleteOne({_id: bookmark._id});
            }else{
                results.push(bookmark);
            }
        }catch(e){console.log(e);}
    };

    res.send(results);
});

router.post("/", auth, async (req, res) => {
    // #swagger.summary = 'Creates a new bookmark.'
    /* #swagger.description = 'Bookmarks are objects which will allow users to bookmark ceration documents, so that they can keep track of their work. Multiple bookmarks for a single document may be created, because each of these bookmarks may belong to different `Space`s. 
    </br> </br>
    ⚠️ If you want to create a bookmark in the user\'s `Global Space`, you don\'t need to provide the `space` field. If you want to create a bookmark in a specific space, you need to provide the `space` field.
    </br>
    </br>
    '
    */

    const documentId = req.body.document;
    const spaceId = req.body.space;

    if (!documentId) return res.status(400).send({ message: 'Invalid document.' });

    if (spaceId) {
        if (!mongoose.Types.ObjectId.isValid(spaceId))
            return res.status(400).send({ message: 'Invalid space id format.' });

        const space = await findOneSpace({ space: spaceId, user: req.user._id })

        if (!space) return res.status(404).send({ message: "Space not found." });
    }

    try {
        const bookmark = await Bookmark.findOneAndUpdate({
            document: documentId,
            user: req.user._id,
            space: spaceId || undefined
        }, {}, { upsert: true, new: true });

        res.send(bookmark);
    } catch (e) {
        console.log(e);
        return res.status(400).send({ message: "Bookmark doesn't match schema." });
    }
});

router.delete("/:id", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Deletes a bookmark.'
    // #swagger.description = '⚠️ Beware that this endpoint is not for changing the space which this `Bookmark` is in. Use `POST /spaces/:spaceId/bookmarks/:bookmarkId` endpoint for this. '

    const bookmark = await Bookmark.deleteMany({ _id: req.params.id, user: req.user._id } );

    if (!bookmark) return res.status(404).send({ message: 'Bookmark not found.' });

    res.send(bookmark);
});

router.delete("/", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Deletes a bookmark with document id.'
    
    const documentId = req.body.document;

    const bookmark = await Bookmark.deleteMany({ document: documentId, user: req.user._id } );

    if (!bookmark) return res.status(404).send({ message: 'Bookmark not found.' });

    res.send(bookmark);
});

module.exports = router;