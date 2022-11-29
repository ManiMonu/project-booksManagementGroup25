const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: objectId,
        required: true,
        ref: 'book'
    },
    reviewedBy: {
        type: string,
        required: true,
        default: 'Guest',
        value: String
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: number,
        required: true
    },

    review: String,

    isDeleted: {
        type: boolean,
        default: false
    },
}, { timestamps: true })

module.exports = new mongoose.model('Review', reviewSchema)