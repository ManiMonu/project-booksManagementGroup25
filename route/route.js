const express = require('express');
const router = express.Router();
const userConttroller = require("../controller/userController")
const bookController = require("../controller/bookController")
const middleware = require("../middleware/authMiddleware")
const reviewController = require('../controller/reviewController')

router.post("/register", userConttroller.createUser)

router.post("/login", userConttroller.loginUser)

router.post("/books", middleware.authentication, bookController.createBook)

router.get("/books", middleware.authentication, bookController.getBooks)

router.get("/books/:bookId", middleware.authentication, bookController.getBooksById)

router.put('/books/:bookId', middleware.authentication, middleware.authorisationForDeleteAndUpdate, bookController.updateBook)

router.delete("/books/:bookId", middleware.authentication, middleware.authorisationForDeleteAndUpdate, bookController.deleteBookById)

router.post("/books/:bookId/review", reviewController.createReview)

router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)

router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)

router.all('/*', function(req, res){
    return res.status(400).send({status: false, message: "path not found"})
})


module.exports = router