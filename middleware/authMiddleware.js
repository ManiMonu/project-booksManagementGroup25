const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const objectId = mongoose.isValidObjectId


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


const authorisation = function(req, res, next){
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




module.exports = { authentication, authorisation }