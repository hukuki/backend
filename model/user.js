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
    },
    auth_provider_id: {
        type: String,
        required: true,
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
    }],
    spaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Space",
    }]
});

userSchema.methods.toJSON = function() {
    var obj = this.toObject(); //or var obj = this;
    delete obj.isAdmin;
    delete obj.isSuper;
    delete obj.auth_provider_id;
    return obj;
}

const User = mongoose.model("User", userSchema);

module.exports = User;