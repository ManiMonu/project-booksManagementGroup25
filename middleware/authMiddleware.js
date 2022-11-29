const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const objectId = mongoose.isValidObjectId
const bookModel = require("../model/bookModel")


const authentication = function(req, res, next){
try{
const token = req.headers['x-api-key']
if(!token){
    return res.status(400).send({status: false, message: "Token is required"})
}
const decodedToken = jwt.verify(token, "group25")

req.decodedToken = decodedToken.userId
next()

}catch(error){
    return res.status(401).send({status: false, message: error.message})
}

}


const authorisationForBookCreation = function(req, res, next){
try{
const decodedToken = req.decodedToken
let userLoggedIn = req.body.userId 

if(!userLoggedIn){
    return res.status(400).send({status: false, message: "UserId is not present"})
}
if(!objectId(userLoggedIn)){
    return res.status(400).send({status: false, message: "Invalid UserId"})
}
if(decodedToken !== userLoggedIn){
    return res.status(403).send({status: false, message: "You do not have access rights"})
}
req.userLoggedIn = userLoggedIn
next()
}catch(error){
    return res.status(500).send({status: false, message: error.message})
}
}


const authorisationForDeleteAndUpdate =  async function(req, res, next){
    try{
const { bookId } = req.params
if(!bookId) return res.status(400).send({status: false, message: "bookId is required"})
if(!objectId(bookId)) return res.status(400).send({status: false, message: "bookId is invalid"})

let savedData = await bookModel.findOne({_id: bookId, isDeleted: false})
if(!savedData) return res.status(404).send({status: false, message: 'No such existing books' })
let userToBeMdified = savedData.userId.toString()
// console.log(userToBeMdified)
let decodedToken = req.decodedToken
// console.log(decodedToken)
    if(decodedToken !== userToBeMdified){
        return res.status(403).send({status: false, message: "You do not have access rights"})
    }
    req.userToBeMdified = userToBeMdified
    next()
    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
    }
    






module.exports = { authentication, authorisationForBookCreation, authorisationForDeleteAndUpdate }