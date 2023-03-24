require('./db.js');

// Path: backend/model/user.js
const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    domain: {
        type: String,
        required: true,
    },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;