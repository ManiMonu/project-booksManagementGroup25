const { mongo, default: mongoose } = require("mongoose");
const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const objectId = mongoose.isValidObjectId

const nameRegex = /^[a-zA-Z ]+$/



const createBook = async function (req, res) {
    try {
        let data = req.body
        let userId = req.userLoggedIn
        let { title, excerpt, ISBN, category, subcategory, releasedAt } = data;

        if (!title) return res.status(400).send({ status: false, message: "Title is not present" })
        if (!title.match(nameRegex)) return res.status(400).send({ status: false, message: "title is not valid" })
        let isTitlePresent = await bookModel.findOne({ title: title })
        if (isTitlePresent) return res.status(400).send({ status: false, message: "Title is already exist" })

        if (!excerpt) return res.status(400).send({ status: false, message: "excerpt is not present" })
        if (!excerpt.match(nameRegex)) return res.status(400).send({ status: false, message: "excerpt is not valid" })

        // if (!userId) return res.status(400).send({ status: false, message: "userId is not present" })
        const isUserIdPresent = await userModel.findById(userId)
        // if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "userId not valid" })
        if (!isUserIdPresent) return res.status(400).send({ status: false, message: "user Id not exist" })

        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is not present" })
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
        if (!Object.keys(requestBody).length > 0) {
            let bookDetails = await bookModel.find({ isDeleted: false }).sort({ title: 1 }).collation({ locale: "en" }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
            if (!bookDetails.length > 0) {
                return res.status(404).send({ status: false, message: "no book found" })
            }
            return res.status(200).send({ status: true, message: 'Success', data: getBooksDetails })
        }

        if (requestBody.subcategory === "") {
            return res.status(400).send({ status: false, message: "please enter a subcategory" })
        }

        if (requestBody.category === "") {
            return res.status(400).send({ status: false, message: "please enter a category" })
        }
        if (requestBody.userId === "") {
            return res.status(400).send({ status: false, message: "please enter user id" })
        }
        if (!objectId(requestBody.userId)) {
            return res.status(400).send({ status: false, message: "UserId is invalid" })
        }

        let getBooksDetails = await bookModel.find({ isDeleted: false, ...requestBody }).sort({ title: 1 }).collation({ locale: "en" }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

        if (getBooksDetails.length == 0) {
            return res.status(404).send({ status: false, msg: 'no book found' })
        } else {
            return res.status(200).send({ status: true, message: 'Success', data: getBooksDetails })
        }


    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



const getBooksById = async function(req, res){
try{
let bookId = req.params.bookId
if(!bookId){
    return res.status(400).send({status: false, message: "BookId is required"})
}
if(!objectId(bookId)){
    return res.status(400).send({status: false, message: "BookId is required"})
}
let savedData = await bookModel.findById(bookId)
if(!savedData){
    return res.status(404).send({status: false, message: 'No books found'})
}

let obj = {reviews: savedData.reviews, createdAt: savedData.createdAt, updatedAt: savedData.updatedAt, _id: savedData._id, title: savedData.title, excerpt: savedData.excerpt, userId:savedData.userId, category: savedData.category, subcategory: savedData.subcategory, isDeleted: savedData.isDeleted, releasedAt: savedData.releasedAt, reviewsData: [] }
return res.status(200).send({status: true, message: 'success', data: obj})

}catch(error){
    return res.status(500).send({status: false, message: error.message})
}
}














module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.getBooksById = getBooksById