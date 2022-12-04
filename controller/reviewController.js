const reviewModel = require('../model/reviewModel')
const bookModel = require('../model/bookModel')
const validator = require('../validator/validator')
const mongoose = require('mongoose')
const objectId = mongoose.isValidObjectId

//--------------------------|| CREATE REVIEW ||--------------------------------

const createReview = async function (req, res) {

    try {

        const bookId = req.params.bookId
        if (!objectId(bookId)) return res.status(400).send({ status: false, message: 'BookId is invalid' })
        const getBooks = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!getBooks) return res.status(404).send({ status: false, message: 'No books exists' })
        const { reviewedBy, rating, review } = req.body

        if (!validator.requiredInput(req.body)) return res.status(400).send({ status: false, message: 'Input is required' })


        let obj = { bookId: getBooks._id, reviewedAt: Date.now() }

        if (reviewedBy) {
            if (!validator.validInput(reviewedBy)) return res.status(400).send({ status: false, message: 'Name is not valid one' })
            if (!validator.validString(reviewedBy)) return res.status(400).send({ status: false, message: 'Name is invalid' })
            obj.reviewedBy = reviewedBy
        }

        if (!validator.validNumber(rating)) return res.status(400).send({ status: false, message: 'rating is not present or valid' })
        if (rating < 1 || rating > 5) return res.status(400).send({ status: false, msg: "rating should be between 1 to 5" })
        obj.rating = rating

        if (review) {
            if (!validator.validInput(review)) return res.status(400).send({ status: false, message: 'review is not valid one' })
            if (!validator.validString(review)) return res.status(400).send({ status: false, message: 'Invalid review' })
            obj.review = review
        }


        const createdReview = await reviewModel.create(obj)
        let updatedBook = await bookModel.findByIdAndUpdate({ _id: createdReview.bookId }, { $inc: { reviews: 1 } }, { new: true }).select({ __v: 0, deletedAt: 0 })
        let newdata = JSON.parse(JSON.stringify(updatedBook))
        newdata.reviewsData = createdReview
        return res.status(201).send({ status: true, message: 'Success', data: newdata })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//--------------------------|| UPDATE REVIEW ||--------------------------------


const updateReview = async function (req, res) {

    try {

        const bookId = req.params.bookId
        if (!objectId(bookId)) return res.status(400).send({ status: false, message: 'BookId is invalid' })
        const getBooks = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0, deletedAt: 0 })
        if (!getBooks) return res.status(404).send({ status: false, message: 'No book exists' })
        const reviewId = req.params.reviewId
        if (!objectId(reviewId)) return res.status(400).send({ status: false, message: 'reviewId is invalid' })
        const getReview = await reviewModel.findOne({ bookId: getBooks._id, _id: reviewId, isDeleted: false })
        if (!getReview) return res.status(404).send({ status: false, message: 'No review exists' })
        const { reviewedBy, rating, review } = req.body

        if (!validator.requiredInput(req.body)) return res.status(400).send({ status: false, message: 'Input is required' })
        if (reviewedBy) {
            if (!validator.validInput(reviewedBy)) return res.status(400).send({ status: false, message: 'Name is not present or valid' })
            if (!validator.validString(reviewedBy)) return res.status(400).send({ status: false, message: 'Name is invalid' })
        }
        if (rating) {
            if (!validator.validNumber(rating)) return res.status(400).send({ status: false, message: 'rating is not present or valid' })
            if (rating < 1 || rating > 5) return res.status(400).send({ status: false, message: "rating should be between 1 to 5" })
        }
        if (review) {
            if (!validator.validInput(review)) return res.status(400).send({ status: false, message: 'Review is not present or valid' })
            if (!validator.validString(review)) return res.status(400).send({ status: false, message: 'Review is invalid' })
        }
        const reviewedData = await reviewModel.findByIdAndUpdate({ _id: getReview._id }, { $set: { rating: rating, review: review, reviewedBy: reviewedBy, reviewedAt: Date.now() } }, { new: true })
        const updatedBook = JSON.parse(JSON.stringify(getBooks))
        updatedBook.reviewedData = reviewedData
        return res.status(200).send({ Status: true, message: 'Books list', data: updatedBook })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//--------------------------|| DELETE REVIEW ||--------------------------------

const deleteReview = async function (req, res) {

    try {

        const bookId = req.params.bookId
        if (!objectId(bookId)) return res.status(400).send({ status: false, message: 'BookId is invalid' })
        const getBooks = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!getBooks) return res.status(404).send({ status: false, message: 'No book exists' })
        const reviewId = req.params.reviewId
        if (!objectId(reviewId)) return res.status(400).send({ status: false, message: 'reviewId is invalid' })
        const getReview = await reviewModel.findOne({ bookId: getBooks._id, _id: reviewId, isDeleted: false })
        if (!getReview) return res.status(404).send({ status: false, message: 'No review exists' })

        let deletedReview = await reviewModel.findByIdAndUpdate({ _id: getReview._id }, { $set: { isDeleted: true } })
        if (deletedReview) {
            await bookModel.findByIdAndUpdate({ _id: deletedReview.bookId }, { $inc: { reviews: -1 } })
            return res.status(200).send({ status: true, message: 'Review deleted successfully' })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





module.exports = { createReview, updateReview, deleteReview }