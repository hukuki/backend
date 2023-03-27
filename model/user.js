require('./db.js');

// Path: backend/model/user.js
const mongoose = require("mongoose");

/*
    isSuper is a boolean that determines if the user is a super user.
    isSuper users can do anything, including creating new organizations,
    isSuper users can also delete organizations,
    isSuper users can also delete other super users,
    and more...
*/

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    email:{
        type: String,
        required: true,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isSuper: {
        type: Boolean,
        default: false,
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;