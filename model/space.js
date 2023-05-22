require('./db.js');

const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    people: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

const Space = mongoose.model("Space", spaceSchema);

module.exports = Space;