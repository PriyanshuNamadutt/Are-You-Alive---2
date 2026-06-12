const mongoose = require("mongoose");

const userschema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: true,
    },
    lastClick: {
        type: Date,
        default: null
    },
    alertSent: {
        type: Boolean,
        default: false 
    }
});

module.exports = mongoose.model("user", userschema);