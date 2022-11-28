const userModel = require("../model/userModel")
const jwt = require('jsonwebtoken')

const phoneRegex = /^[0]?[789]\d{9}$/
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/


const createUser = async function (req, res) {
    try{
    let data = req.body;
    let { title, name, phone, email, password } = data;

    if (!title) return res.status(400).send({ status: false, message: "title is not present" })
    if (title != "Mr" && title != "Mrs" && title != "Miss") return res.status(400).send({ status: false, message: "Title should be Mr, Mrs or Miss" })


    if (!name) return res.status(400).send({ status: false, message: "Name is not present" })

    if (!phone) return res.status(400).send({ status: false, message: "Phone is not present" })
    const isPhonePresent = await userModel.findOne({ phone: phone })
    if (isPhonePresent) return res.status(400).send({ status: false, message: "Phone No is already exist" })
    if (!phone.match(phoneRegex)) return res.status(400).send({ status: false, message: "phone no is not valid" })

    if (!email) return res.status(400).send({ status: false, message: "email is not present" })
    const isEmailPresent = await userModel.findOne({ email: email })
    if (isEmailPresent) return res.status(400).send({ status: false, message: "email is already exist" })
    if (!email.match(emailRegex)) return res.status(400).send({ status: false, message: "email is not valid" })

    if (!password) return res.status(400).send({ status: false, message: "Password is not present" })

    let newData = await userModel.create(data)
    return res.status(201).send({status : true, message: "User Data successfully created", data : newData })
    }
    catch(error){
        return res.status(500).send({status : false, message : error.message})
    }
}


const loginUser = async function (req, res) {

    try {
        const { email, password } = req.body

        if (!Object.keys(req.body).length > 0) {
            return res.status(400).send({ status: false, msg: "Please provide details for login" })
        };

        if (!email) {
            return res.status(400).send({ status: false, msg: "Provide email" })
        };


        if (!password) {
            return res.status(400).send({ status: false, msg: "Provide password" })
        };

        let savedData = await userModel.findOne({ email, password })
        if (!savedData) {
            return res.status(404).send({ status: false, message: "No such data" })
        };

        //--------create token ----------------------------------------------------------------------------------------------------------------
        let encodeToken = jwt.sign({ userId: savedData._id, iat: (new Date().getTime() / 1000 + 60 * 60) }, "group25")
        return res.status(200).send({ status: true, message: 'Success', data: encodeToken })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createUser = createUser
module.exports.loginUser = loginUser