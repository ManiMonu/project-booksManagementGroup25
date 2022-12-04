const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const objectId = mongoose.isValidObjectId
const bookModel = require("../model/bookModel")
const validator = require('../validator/validator')



const authentication = function (req, res, next) {
    try {
        const token = req.headers['x-api-key']
        if (!token) {
            return res.status(401).send({ status: false, message: "Token is required" })
        }
        jwt.verify(token, "group25", function (error, decodedToken) {
            if (error && error.message === 'jwt expired') return res.status(401).send({ status: false, message: 'token expired, please login again' })
            if (error) return res.status(401).send({ status: false, message: 'Invalid token' })
            else {
                req.decodedToken = decodedToken.userId
                next()
            }
        })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}


const authorisationForDeleteAndUpdate = async function (req, res, next) {
    try {
        if (!objectId(bookId)) return res.status(400).send({ status: false, message: "bookId is invalid" })

        let savedData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!savedData) return res.status(404).send({ status: false, message: 'No such existing books' })
        let userToBeModified = savedData.userId.toString()
        let decodedToken = req.decodedToken
        if (decodedToken !== userToBeModified) {
            return res.status(403).send({ status: false, message: "You do not have access rights" })
        }
        req.bookId = bookId
        next()
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}







module.exports = { authentication, authorisationForDeleteAndUpdate }