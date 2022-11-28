const express = require('express');
const router = express.Router();
const userConttroller = require("../controller/userController")

router.get("/", function (req,res){
    res.send("this is done")
})


router.post("/user", userConttroller.createUser)



module.exports = router