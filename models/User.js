const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    steam: {
        type: Object,
        required: true
    },
    balance:{
        type: Number,
        required: true
    }
});

module.exports = User = mongoose.model("user", UserSchema);