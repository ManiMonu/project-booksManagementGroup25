const reviewModel = require('../model/reviewModel')
const bookModel = require('../model/bookModel')
const validator = require('../validator/validator')
const mongoose = require('mongoose')
const objectId = mongoose.isValidObjectId

const reviewBook = async function (req, res) {

    try {

        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: 'BookId is required' })
        if (!objectId(bookId)) return res.status(400).send({ status: false, message: 'BookId is invalid' })
        const getBooks = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!getBooks) return res.status(404).send({ status: false, message: 'No books exists' })
        const { reviewedBy, rating, review } = req.body

        if (!validator.requiredInput(req.body)) return res.status(400).send({ status: false, message: 'Input is required' })


        let obj = { bookId: getBooks._id, reviewedAt: Date.now() }
        
        if (reviewedBy) {
            if (!validator.validInput(reviewedBy)) return res.status(400).send({ status: false, message: 'Name is required' })
            if (!validator.validString(reviewedBy)) return res.status(400).send({ status: false, message: 'Name is invalid' })
            obj.reviewedBy = reviewedBy
        }
        if (rating) {
            if (!validator.validNumber(rating)) return res.status(400).send({ status: false, message: 'rating is not present' })
            if ((!(rating <= 5) && (rating >= 1))) return res.status(400).send({ status: false, msg: "rating should be between 1 to 5" })
            obj.rating = rating
        }

        if (review) {
            if (!validator.validInput(review)) return res.status(400).send({ status: false, message: 'review is required' })
            if (!validator.validString(review)) return res.status(400).send({ status: false, message: 'Invalid review' })
            obj.review = review
        }


        const reviewedData = await reviewModel.create(obj)
        return res.status(201).send(reviewedData)

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const updateReview = async function (req, res) {

    try {

        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: 'BookId is required' })
        if (!objectId(bookId)) return res.status(400).send({ status: false, message: 'BookId is invalid' })
        const getBooks = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!getBooks) return res.status(404).send({ status: false, message: 'No book exists' })
        const reviewId = req.params.reviewId
        if (!reviewId) return res.status(400).send({ status: false, message: 'ReviewId is required' })
        if (!objectId(reviewId)) return res.status(400).send({ status: false, message: 'reviewId is invalid' })
        const getReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!getReview) return res.status(404).send({ status: false, message: 'No review exists' })
        const { reviewedBy, rating, review } = req.body

        if (!validator.requiredInput(req.body)) return res.status(400).send({ status: false, message: 'Input is required' })

        if (reviewedBy) {
            if (!validator.validInput(reviewedBy)) return res.status(400).send({ status: false, message: 'Name is required' })
            if (!validator.validString(reviewedBy)) return res.status(400).send({ status: false, message: 'Name is invalid' })
        }
        if (rating) {
            if (!validator.validNumber(rating)) return res.status(400).send({ status: false, message: 'rating is not present' })

            // if((!(rating<=5) && (rating>=1))) return res.status(400).send({status:false,msg:"rating should be between 1 to 5"})
        }
        if (review) {
            if (!validator.validInput(reviewedBy)) return res.status(400).send({ status: false, message: 'Name is required' })
            if (!validator.validString(reviewedBy)) return res.status(400).send({ status: false, message: 'Name is invalid' })
        }



        const reviewedData = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { rating: rating, reviewedBy: reviewedBy, review: review, reviewedAt: Date.now() } }, { new: true })
        return res.status(200).send(reviewedData)

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const deleteReview = async function (req, res) {

    try {

        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: 'BookId is required' })
        if (!objectId(bookId)) return res.status(400).send({ status: false, message: 'BookId is invalid' })
        const getBooks = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!getBooks) return res.status(404).send({ status: false, message: 'No book exists' })
        const reviewId = req.params.reviewId
        if (!reviewId) return res.status(400).send({ status: false, message: 'ReviewId is required' })
        if (!objectId(reviewId)) return res.status(400).send({ status: false, message: 'reviewId is invalid' })
        const getreview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!getreview) return res.status(404).send({ status: false, message: 'No review exists' })

        await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { isDeleted: true } })
        return res.status(200).send({ status: true, message: "Successfully deleted review" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





module.exports = { reviewBook, updateReview, deleteReview }