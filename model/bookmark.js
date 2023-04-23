require('./db.js');

const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
    document: {
        type: String,
        required: true
    },
    space: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Space',
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;