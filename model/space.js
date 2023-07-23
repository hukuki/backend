require('./db.js');

const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    people: [ {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            role: {
                type: String,
                enum: ["editor", "observer", "manager"],
                default: "observer",
                required: true
            }
        }],
    documents: [{
            document: {
                type: mongoose.Schema.Types.String,
            },
            addedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }],
});

const Space = mongoose.model("Space", spaceSchema);

module.exports = Space;