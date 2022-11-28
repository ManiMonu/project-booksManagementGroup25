const { mongo, default: mongoose } = require("mongoose");
const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")


/*
- Create a book document from request body. Get userId in request body only.
- Make sure the userId is a valid userId by checking the user exist in the users collection.
- Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like [this](#successful-response-structure) 
- Create atleast 10 books for each user
- Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)
*/
const createBook = async function (req, res) {
    let data = req.body
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;
    if (!title) return res.status(400).send({ status: false, message: "Title is not present" })

    if (!excerpt) return res.status(400).send({ status: false, message: "excerpt is not present" })

    if (!userId) return res.status(400).send({ status: false, message: "userId is not present" })
    const isUserIdPresent = await userModel.findOne({ userId: userId })
    if (!isUserIdPresent) return res.status(400).send({ status: false, message: "user Id not exist" })
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "userId not valid" })

    if(!ISBN) return res.status(400).send({status : false, message : "ISBN is not present"})

    if(!category) return res.status(400).send({status : false, message : "category is not present"})

    if(!subcategory) return res.status(400).send({status : false, message : "subcategory is not present"})

    if(!releasedAt) return res.status(400).send({status : false, message : "releasedAt is not present"})

    let newData = await bookModel.create(data)

    return res.status(400).send({status : true, message : "Book Successfully create", data : newData})


}

module.exports.createBook = createBook