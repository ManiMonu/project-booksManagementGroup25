const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: objectId,
        ref: "user",
        required: true
    },
    ISBN: {
        type: String,
        required: true,
        unique: true
    },
    bookCover: String,
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: String,
        required: true,
        trim: true
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: true,
        trim: true
    }

}, { timestamps: true })

module.exports = new mongoose.model("book", bookSchema)