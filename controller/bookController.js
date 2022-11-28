const { mongo, default: mongoose } = require("mongoose");
const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")

const nameRegex = /^[a-zA-Z ]+$/



const createBook = async function (req, res) {
    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;

        if (!title) return res.status(400).send({ status: false, message: "Title is not present" })
        if (!title.match(nameRegex)) return res.status(400).send({ status: false, message: "title is not valid" })
        let isTitlePresent = await bookModel.findOne({ title: title })
        if (isTitlePresent) return res.status(400).send({ status: false, message: "Title is already exist" })

        if (!excerpt) return res.status(400).send({ status: false, message: "excerpt is not present" })
        if (!excerpt.match(nameRegex)) return res.status(400).send({ status: false, message: "excerpt is not valid" })

        if (!userId) return res.status(400).send({ status: false, message: "userId is not present" })
        const isUserIdPresent = await userModel.findById(userId)
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "userId not valid" })
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

        return res.status(400).send({ status: true, message: "Book Successfully create", data: newData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports.createBook = createBook