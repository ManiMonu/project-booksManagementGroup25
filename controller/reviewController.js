const reviewModel = require('../model/reviewModel')
const bookModel = require('../model/bookModel')
const mongoose = require('mongoose')
const objectId = mongoose.isValidObjectId
const nameRegex = /^[a-zA-Z ]+$/

const reviewBook = async function (req, res) {

    try {

        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: 'BookIld is required' })
        if (!objectId(bookId)) return res.status(400).send({ status: false, message: 'BookId is invalid' })
        const getBooks = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!getBooks) return res.status(404).send({ status: false, message: 'No books exists' })
        const { reviewedBy, rating, review } = req.body

        if (!Object.keys(req.body).length > 0) return res.status(400).send({ status: false, message: 'Input is required' })


        let obj = { bookId: getBooks._id, reviewedAt: Date.now() }
        if (reviewedBy) {
            if (!reviewedBy.match(nameRegex)) return res.status(400).send({ status: false, message: 'Name is invalid' })
            obj.reviewedBy = reviewedBy
        }
        if (!rating) return res.status(400).send({ status: false, message: 'rating is not present' })

        if (typeof rating !== 'number') return res.status(400).send({ status: false, message: 'Invalid rating' })

        // if((!(rating<=5) && (rating>=1))) return res.status(400).send({status:false,msg:"rating should be between 1 to 5"})

        obj.rating = rating
        if (review) {
            if (!review.match(nameRegex)) return res.status(400).send({ status: false, message: 'Invalid review' })
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
        const getreview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!getreview) return res.status(404).send({ status: false, message: 'No review exists' })
        const { reviewedBy, rating, review } = req.body

        if (!Object.keys(req.body).length > 0) return res.status(400).send({ status: false, message: 'Input is required' })


        let obj = { bookId: getBooks._id, reviewedAt: Date.now() }
        if (reviewedBy) {
            if (!reviewedBy.match(nameRegex)) return res.status(400).send({ status: false, message: 'Name is invalid' })
            obj.reviewedBy = reviewedBy
        }
        if (rating) {
            if (typeof rating !== 'number') return res.status(400).send({ status: false, message: 'Invalid rating' })

            // if((!(rating<=5) && (rating>=1))) return res.status(400).send({status:false,msg:"rating should be between 1 to 5"})

            obj.rating = rating
        }
        if (review) {
            if (!review.match(nameRegex)) return res.status(400).send({ status: false, message: 'Invalid review' })
            obj.review = review
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

        await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { isDeleted: true, reviewedAt: Date.now() } })
        return res.status(200).send({status: false, message: "Successfully deleted review"})

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





module.exports = { reviewBook, updateReview, deleteReview }