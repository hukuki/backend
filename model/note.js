require('./db.js');

const mongoose = require("mongoose");

/*
    Every note has a document, a user, and a space.
    If the space is null, then the note is a global note for that user.
    If the space is not null, then the note belongs to that space.
*/

const noteSchema = new mongoose.Schema({
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    from: {
        type: Number,
        required: true
    },
    to: {
        type: Number,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: false
    },
    space: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Space',
        required: false
    }
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;