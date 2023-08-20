require('./db.js');

const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    ip_address: {
        type: String,
    },
    endpoint: {
        type: String,
        required: true
    },
    params: {
        type: Object
    },
    http_query: {
        type: Object
    },
    request_body: {
        type: Object
    },
    response: {
        type: Object
    },
}, {timestamps: true});

const Log = mongoose.model("Log", logSchema);

module.exports = Log;