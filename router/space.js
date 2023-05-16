const express = require("express");
const Space = require("../model/space.js");
const Note = require("../model/note.js");
const Bookmark = require("../model/bookmark.js");
const User = require("../model/user.js");
const auth = require("../middleware/auth.js");
const verifyId = require("../middleware/verifyId.js");

const { findOneSpace, findSpaces } = require("./util/space.js");
const { getDocument } = require("./util/document");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    // #swagger.summary = 'Get all the spaces which the user created or added to.'
    // #swagger.description = 'Spaces are models that represent a project/folder, in which `Note`s and `Bookmark`s within are related to a certain case or project. This feature is useful since user can group different stuff.
    const spaces = await findSpaces({ user: req.user._id });

    res.send(spaces);
});

router.get("/:spaceId", auth, async (req, res) => {
    // #swagger.summary = 'Get a specific space which the user created or added to.'
    const space = await Space.findOne({ _id: req.params.spaceId }).populate('people').populate('user');

    if (!space) return res.status(404).send({ message: "Space not found." });


    const bookmarks = await Bookmark.find({ space: space._id });

    let bookmarksObjects = bookmarks.map(bookmark => bookmark.toJSON());
    
    for(let bookmark of bookmarksObjects){
        bookmark.document = await getDocument(bookmark.document);
    }

    let result = space.toJSON();
    result.bookmarks = bookmarksObjects;

    res.send(result);
});

router.get('/:spaceId/users', auth, async (req, res) => {
    // #swagger.summary = 'Get all the users in a space.'

    const space = await findOneSpace({ space: req.params.spaceId, user: req.user._id });

    if (!space) return res.status(404).send({ message: "Space not found." });

    res.send(space.people);
});

router.post("/", auth, async (req, res) => {
    // #swagger.summary = 'Create a new space.'

    if (!req.body.name)
        return res.status(400).send({ message: "Space name is required." });

    const people = (req.body.people) ?
        await User.find({ _id: { $in: req.body.people } })
        : [];

    const space = await Space.create({
        user: req.user._id,
        name: req.body.name,
        people: people
    });

    res.send(space);
});

router.delete("/:spaceId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Delete a space.'

    const space = await Space.findOneAndDelete({ _id: req.params.spaceId, user: req.user._id })
        .populate('people')
        .populate('user');

    if (!space) return res.status(404).send({ message: "Space not found." });

    await Note.updateMany({ user: req.user._id, space: space._id }, { space: null });

    res.send(space);
});

/*
router.get("/:spaceId/notes", auth, async (req, res) => {
    // #swagger.summary = 'Get all the notes in a space.'

    const space = await findOneSpace({ space: req.params.spaceId, user: req.user._id });


    if (!space) return res.status(404).send({ message: "Space not found." });

    console.log(space);

    const notes = await Note.find({ space: space._id }).populate('user');

    res.send(notes);
});
*/

router.post("/:spaceId/users", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Add collegues to a space.'

    const { people } = req.body;

    const users = await User.find({
        _id: {
            $in: people
        },
        organization: req.user.organization
    });

    // Here, we don't use the helper findOneSpace, because only the owner of the space 
    // can add an user to the space.

    const space = await Space.findOne({ _id: req.params.spaceId, user: req.user._id })
        .populate('people')
        .populate('user');

    if (!space) return res.status(404).send({ message: "Space not found." });

    space.people.pull({
        _id: {
            $in: users.map(user => user._id)
        }
    });
    space.people.push(users);
    await space.save();

    res.send(space);
});

router.delete("/:spaceId/users/", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Delete a collegue from the space.'

    const { people } = req.body;

    const users = await User.find({
        _id: {
            $in: people
        },
        organization: req.user.organization
    });

    // Here, we don't use the helper findOneSpace,
    // because only the owner can delete an user from the space.

    const space = await Space.findOne({ _id: req.params.spaceId, user: req.user._id })
        .populate('people')
        .populate('user');

    if (!space) return res.status(404).send({ message: "Space not found." });

    space.people.pull({
        _id: {
            $in: users.map(user => user._id)
        }
    });

    await space.save();

    res.send(space);
});

router.post("/:spaceId/bookmarks", auth, async (req, res) => {
    // #swagger.summary = 'Create a bookmark in the space.'
    const { document } = req.body;

    const space = await findOneSpace({ space: req.params.spaceId, user: req.user._id });

    if (!space) return res.status(404).send({ message: "Space not found." });

    const bookmark = await Bookmark.create({ space: space._id, document });

    res.send(bookmark);
});

router.get("/:spaceId/bookmarks", auth, async (req, res) => {
    // #swagger.summary = 'Get all the bookmarks in a space.'

    const space = await findOneSpace({ space: req.params.spaceId, user: req.user._id });

    if (!space) return res.status(404).send({ message: "Space not found." });

    const bookmarks = await Bookmark.find({ space: space._id }).populate('user');;
    
    let bookmarksObjects = bookmarks.map(bookmark => bookmark.toJSON());
    
    for(let bookmark of bookmarksObjects){
        bookmark.document = await getDocument(bookmark.document);
    }
    
    res.send(bookmarksObjects);
});

router.delete("/:spaceId/bookmarks/:bookmarkId", auth, async (req, res) => {
    // #swagger.summary = 'Delete a bookmark from the space.'
    const bookmarkId = req.params.bookmarkId;

    const space = await findOneSpace({ space: req.params.spaceId, user: req.user._id });

    if (!space) return res.status(404).send({ message: "Space not found." });

    const bookmark = await Bookmark.deleteOne({
        space: space._id,
        _id: bookmarkId
    });

    res.send(bookmark);
});


module.exports = router;