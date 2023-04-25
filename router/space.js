const express = require("express");
const Space = require("../model/space.js");
const Note = require("../model/note.js");
const Bookmark = require("../model/bookmark.js");
const User = require("../model/user.js");
const auth = require("../middleware/auth.js");
const verifyId = require("../middleware/verifyId.js");

const router = express.Router();

const findOneSpace = async ({ space, user }) => {
    /* Get the space which user has created, or has been added to. */

    return await Space.findOne({ _id: space })
        .or([{ user: user }, { "people": user }]);
}

const findSpaces = async ({ user }) => {
    /*  Gets all the spaces that user have access to, i.e. 
        all spaces created by the user, or spaces that the user is added to. 
    */

    return await Space.find()
        .or([{ user: user }, { "people": user }])
        .populate('people')
        .populate('user');
}


router.get("/", auth, async (req, res) => {
    // #swagger.summary = 'Get all the spaces which the user created or added to.'
    // #swagger.description = 'Spaces are models that represent a project/folder, in which `Note`s and `Bookmark`s within are related to a certain case or project. This feature is useful since user can group different stuff.
    const spaces = await findSpaces({ user: req.user._id });

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

    const space = await Space.findOneAndDelete({ _id: req.params.spaceId, user: req.user._id })
        .populate('people')
        .populate('user');

    if (!space) return res.status(404).send({ message: "Space not found." });

    await Note.updateMany({ user: req.user._id, space: space._id }, { space: null });

    res.send(space);
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
        const space = await findOneSpace({ space: req.params.spaceId, user: req.user._id });

        if (!space) return res.status(404).send({ message: "Space not found." });

        await Note.updateOne({ _id: req.params.noteId, user: req.user._id }, { space: space._id });
    }

    res.send();
});

router.get("/:spaceId/notes", auth, async (req, res) => {
    // #swagger.summary = 'Get all the notes in a space.'

    const space = await findOneSpace({ space: req.params.spaceId, user: req.user._id });


    if (!space) return res.status(404).send({ message: "Space not found." });

    console.log(space);

    const notes = await Note.find({ space: space._id }).populate('user');

    res.send(notes);
});

router.post("/:spaceId/bookmarks/:bookmarkId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Move a bookmark to a space.'

    /* #swagger.description = 
    '   When a `Bookmark` is first created, it is located in user\'s `Global Space`. After user creates `Space`s, they can move their bookmarks to these different spaces.
        </br>
        </br>
        ⚠️ To move a `Bookmark` back to the user\'s `Global Space`, you need to provide the user\'s id instead of space id, in the `spaceId` field.' 
    */

    if (req.user._id.equals(req.params.spaceId)) {
        await Bookmark.updateOne({ _id: req.params.bookmarkId, user: req.user._id }, { space: null });
    } else {
        const space = await findOneSpace({ space: req.params.spaceId, user: req.user._id });

        if (!space) return res.status(404).send({ message: "Space not found." });

        await Bookmark.updateOne({ _id: req.params.bookmarkId, user: req.user._id }, { space: space._id });
    }

    res.send();
});

router.post("/:spaceId/users/:userId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Add a collegue to a space.'

    const user = await User.findOne({ _id: req.params.userId, organization: req.user.organization });

    // Here, we don't use the helper findOneSpace, because only the owner of the space 
    // can add an user to the space.

    const space = await Space.findOne({ _id: req.params.spaceId, user: req.user._id })
        .populate('people')
        .populate('user');

    if (!space) return res.status(404).send({ message: "Space not found." });

    space.people = space.people.filter((item) => {
        console.log(item);
        return item._id != user._id;
    });

    space.people.pull({ _id: user._id });
    space.people.push(user);

    await space.save();

    res.send(space);
});

router.delete("/:spaceId/users/:userId", auth, verifyId, async (req, res) => {
    // #swagger.summary = 'Add a collegue to a space.'

    const user = await User.findOne({ _id: req.params.userId, organization: req.user.organization });

    // Here, we don't use the helper findOneSpace,
    // because only the owner can delete an user from the space.

    const space = await Space.findOne({ _id: req.params.spaceId, user: req.user._id })
        .populate('people')
        .populate('user');

    if (!space) return res.status(404).send({ message: "Space not found." });

    space.people.pull({ _id: user._id });
    await space.save();

    res.send(space);
});

router.get("/:spaceId/bookmarks", auth, async (req, res) => {
    // #swagger.summary = 'Get all the bookmarks in a space.'

    const space = await findOneSpace({ space: req.params.spaceId, user: req.user._id });

    if (!space) return res.status(404).send({ message: "Space not found." });

    const bookmarks = await Bookmark.find({ space: space._id }).populate('user');;

    res.send(bookmarks);
});


module.exports = router;