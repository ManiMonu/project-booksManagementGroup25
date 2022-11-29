const express = require('express');
const router = express.Router();
const userConttroller = require("../controller/userController")
const bookController = require("../controller/bookController")
const middleware = require("../middleware/authMiddleware")


router.post("/register", userConttroller.createUser)

router.post("/login", userConttroller.loginUser)

router.post("/books", middleware.authentication, middleware.authorisation, bookController.createBook)

router.get("/books", middleware.authentication, bookController.getBooks)

router.get("/books/:bookId", middleware.authentication, bookController.getBooksById)

module.exports = router