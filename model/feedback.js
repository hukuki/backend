require('./db.js');

const e = require('express');
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    email: {
        type: String,
    },
    ip_address: {
        type: String,
    },
    category: {
        type: String,
        required: true,
        enum: ['general', 'bug', 'feature-request'],
        default: 'general'
    },
    feedback: {
        type: String,
        required: true
    },
}, {timestamps: true});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;