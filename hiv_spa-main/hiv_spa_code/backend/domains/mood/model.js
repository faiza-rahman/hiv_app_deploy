const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mood: {
        type: String,
        enum: ["happy", "fine", "neutral", "down", "sad"]
    },
    date: {
        type: Date,
        required: true,
    },
    diaryEntry: {
        type: String,
        default: ""
    },
}, { timestamps: true });

module.exports = mongoose.model("Mood", moodSchema);