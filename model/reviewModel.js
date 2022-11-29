const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: objectId,
        required: true,
        ref: 'book'
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest'
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },

    review: String,

    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

module.exports = new mongoose.model('Review', reviewSchema)