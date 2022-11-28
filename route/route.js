const express = require('express');
const router = express.Router();
const userConttroller = require("../controller/userController")
const bookController = require("../controller/bookController")

router.get("/", function (req,res){
    res.send("this is done")
})


router.post("/user", userConttroller.createUser)

router.post("/book", bookController.createBook)

module.exports = router