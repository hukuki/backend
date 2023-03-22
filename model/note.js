require('./db.js');

const mongoose = require("mongoose");

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
        required: true
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

const Note = mongoose.model("note", noteSchema);

module.exports = Note;