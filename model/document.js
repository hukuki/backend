require('./db.js');

// Path: backend/model/document.js
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    // This is added for the purpose of testing.
    // It might not be a part of the actual document schema (or it may be).
    content: {
        type: String,
    },
});

const document = mongoose.model("Document", documentSchema);

module.exports = document;