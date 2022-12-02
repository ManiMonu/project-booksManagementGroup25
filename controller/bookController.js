const { mongo, default: mongoose } = require("mongoose");
const bookModel = require("../model/bookModel");
const reviewModel = require("../model/reviewModel");
const userModel = require("../model/userModel")
const objectId = mongoose.isValidObjectId
const validator = require('../validator/validator')

// const nameRegex = /^[a-zA-Z ]+$/



const createBook = async function (req, res) {
    try {
        let data = req.body
        if (!validator.requiredInput(req.body)) return res.status(400).send({ status: false, message: 'Input is required' })
        let userId = req.userLoggedIn
        let { title, excerpt, ISBN, category, subcategory, releasedAt } = data;

        if (!validator.validInput(title)) return res.status(400).send({ status: false, message: "Title is not present" })
        if (!validator.validString(title)) return res.status(400).send({ status: false, message: "title is not valid" })
        let isTitlePresent = await bookModel.findOne({ title: title })
        if (isTitlePresent) return res.status(400).send({ status: false, message: "Title is already exist" })

        if (!validator.validInput(excerpt)) return res.status(400).send({ status: false, message: "excerpt is not present" })
        if (!validator.validString(excerpt)) return res.status(400).send({ status: false, message: "excerpt is not valid" })

        const isUserIdPresent = await userModel.findById(userId)
        if (!isUserIdPresent) return res.status(400).send({ status: false, message: "user Id not exist" })

        if (!validator.validInput(ISBN)) return res.status(400).send({ status: false, message: "ISBN is not present" })
        if (Object.keys(ISBN).length != 10 && Object.keys(ISBN).length != 13) return res.status(400).send({ status: false, message: "ISBN is not valid" })
        let isISBNPresent = await bookModel.findOne({ ISBN: ISBN })
        if (isISBNPresent) return res.status(400).send({ status: false, message: "ISBN is already exist" })

        if (!category) return res.status(400).send({ status: false, message: "category is not present" })
        if (!category.match(nameRegex)) return res.status(400).send({ status: false, message: "category is not valid" })

        if (!subcategory) return res.status(400).send({ status: false, message: "subcategory is not present" })
        if (!subcategory.match(nameRegex)) return res.status(400).send({ status: false, message: "subcategory is not valid" })

        if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt is not present" })

        let newData = await bookModel.create(data)

        return res.status(201).send({ status: true, message: "Book Successfully create", data: newData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getBooks = async function (req, res) {
    try {

        let requestBody = req.query
        let { subcategory, category, userId } = requestBody
        if (!validator.requiredInput(requestBody)) {
            let bookDetails = await bookModel.find({ isDeleted: false }).sort({ title: 1 }).collation({ locale: "en" }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
            if (!bookDetails.length > 0) {
                return res.status(404).send({ status: false, message: "no book found" })
            }
            return res.status(200).send({ status: true, message: 'Success', data: bookDetails })
        }
        let obj = { isDeleted: false }
        if (subcategory) {
            obj.subcategory = subcategory
        }
        if (category) {
            obj.category = category
        }


        if (userId) {
            if (!objectId(userId)) {
                return res.status(400).send({ status: false, message: "UserId is invalid" })
            }
            obj.userId = userId
        }
        let getBooksDetails = await bookModel.find(obj).sort({ title: 1 }).collation({ locale: "en" }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

        if (getBooksDetails.length === 0) {
            return res.status(404).send({ status: false, msg: 'no book found' })
        } else {
            return res.status(200).send({ status: true, message: 'Success', data: getBooksDetails })
        }


    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const getBooksById = async function (req, res) {
    try {
        let { bookId } = req.params
        if (!bookId) {
            return res.status(400).send({ status: false, message: "BookId is required" })
        }
        if (!objectId(bookId)) {
            return res.status(400).send({ status: false, message: "BookId is required" })
        }
        let savedData = await bookModel.findOne({ bookId, isDeleted: false })
        if (!savedData) {
            return res.status(404).send({ status: false, message: 'No books found' })
        }

        let reviewData = await reviewModel.find({ bookId: savedData._id, isDeleted: false })

        let obj = { reviews: savedData.reviews, createdAt: savedData.createdAt, updatedAt: savedData.updatedAt, _id: savedData._id, title: savedData.title, excerpt: savedData.excerpt, userId: savedData.userId, category: savedData.category, subcategory: savedData.subcategory, isDeleted: savedData.isDeleted, releasedAt: savedData.releasedAt, reviewsData: reviewData }
        return res.status(200).send({ status: true, message: 'success', data: obj })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//--------------------------|| UPDATE BOOKS ||--------------------------------

const updateBook = async function (req, res) {
    try {
        let bookId = req.bookId

        let updatedata = req.body;
        if (!validator.requiredInput(updatedata)) return res.status(400).send({ status: false, message: 'Enter input for updation' })

        let { title, excerpt, ISBN, releasedAt } = updatedata;

        const dateFormate = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

        if (releasedAt) {
            if (!releasedAt.match(dateFormate)) {
                return res.status(400).send({ status: false, message: "Invalid format of date :- YYYY-MM-DD" })
            }
        }
        if (title) {
            if (!validator.validInput(title)) return res.status(400).send({ status: false, message: 'Title is not present' })
            if (!validator.validString(title)) return res.status(400).send({ status: false, message: 'Title is invalid' })
        }
        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) {
            return res.status(400).send({ status: false, message: "title must be unique" })
        }

        if (ISBN) {
            if (!validator.validInput(ISBN)) return res.status(400).send({ status: false, message: 'ISBN is not present' })
            if (!validator.validISBN(ISBN)) return res.status(400).send({ status: false, message: 'ISBN is invalid' })
        }
        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) {
            return res.status(400).send({ status: false, message: "ISBN must be unique" })
        }

        // let availabId = await bookModel.findOne({ _id: bookId, isDeleted: false });
        // if (!availabId) {
        //     return res.status(404).send({ status: false, msg: "bookId is not present in db" })
        // }

        let bookupdate = await bookModel.findOneAndUpdate({ _id: bookId },
            { $set: { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt } },
            { new: true });

        return res.status(200).send({ status: true, message: 'Success', data: bookupdate });


    } catch (error) {
        return res.status(500).send(error.message)
    }

}







const deleteBookById = async function (req, res) {
    try {
        let bookId = req.bookId

        await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true } })
        return res.status(200).send({ status: true, message: "successfully deleted" })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}








module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.getBooksById = getBooksById
module.exports.updateBook = updateBook
module.exports.deleteBookById = deleteBookById