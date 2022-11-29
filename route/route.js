const express = require('express');
const router = express.Router();
const userConttroller = require("../controller/userController")
const bookController = require("../controller/bookController")
const middleware = require("../middleware/authMiddleware")


router.post("/register", userConttroller.createUser)

router.post("/login", userConttroller.loginUser)

router.post("/books", middleware.authentication, middleware.authorisationForBookCreation, bookController.createBook)

router.get("/books", middleware.authentication, bookController.getBooks)

router.get("/books/:bookId", middleware.authentication, bookController.getBooksById)

router.put('/books/:bookId', middleware.authentication,middleware.authorisationForDeleteAndUpdate,bookController.updateBook)

router.delete("/books/:bookId", middleware.authentication, middleware.authorisationForDeleteAndUpdate, bookController.deleteBookById)

module.exports = router