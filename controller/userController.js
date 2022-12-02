const userModel = require("../model/userModel")
const jwt = require('jsonwebtoken')
const validator = require('../validator/validator')

// const phoneRegex = /^[0]?[789]\d{9}$/
// const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
// const nameRegex = /^[a-zA-Z ]+$/


const createUser = async function (req, res) {
    try {

        let data = req.body;
        if (!validator.requiredInput(data)) return res.status(400).send({ status: false, message: 'Input is required' })
        let { title, name, phone, email, password, address } = data;

        if (!validator.validInput(title)) return res.status(400).send({ status: false, message: "title is not present" })
        if (!["Mr", "Mrs", "Miss"].includes(title)) return res.status(400).send({ status: false, message: "Title should be Mr, Mrs or Miss" })


        if (!validator.validInput(name)) return res.status(400).send({ status: false, message: "Name is not present" })
        if (!validator.validString(name)) return res.status(400).send({ status: false, message: "name is not valid" })

        if (!validator.validInput(phone)) return res.status(400).send({ status: false, message: "Phone is not present" })
        if (!validator.validPhone(phone)) return res.status(400).send({ status: false, message: "phone no is not valid" })
        const isPhonePresent = await userModel.findOne({ phone: phone })
        if (isPhonePresent) return res.status(400).send({ status: false, message: "Phone No is already exist" })

        if (!validator.validInput(email)) return res.status(400).send({ status: false, message: "email is not present" })
        if (!validator.validEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        const isEmailPresent = await userModel.findOne({ email: email })
        if (isEmailPresent) return res.status(400).send({ status: false, message: "email is already exist" })


        if (!validator.validInput(password)) return res.status(400).send({ status: false, message: "Password is not present" })
        if (!validator.validPassword(password)) return res.status(400).send({ status: false, message: "password is not valid" })
        if (address.street) {
            if (!validator.validInput(address.street)) return res.status(400).send({ status: false, message: 'Street is not valid' })
        }
        if (address.city) {
            if (!validator.validInput(address.city)) return res.status(400).send({ status: false, message: 'City is not valid' })
        }
        if (address.pincode) {
            if (!validator.validInput(address.pincode)) return res.status(400).send({ status: false, message: 'Pincode is not valid' })
        }

        let newData = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User Data successfully created", data: newData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const loginUser = async function (req, res) {

    try {
        const { email, password } = req.body

        if (!validator.requiredInput(req.body)) {
            return res.status(400).send({ status: false, message: "Please provide details for login" })
        };

        if (!validator.validInput(email)) {
            return res.status(400).send({ status: false, message: "Provide email" })
        };


        if (!validator.validInput(password)) {
            return res.status(400).send({ status: false, message: "Provide password" })
        };

        let savedData = await userModel.findOne({ email, password })
        if (!savedData) {
            return res.status(404).send({ status: false, message: "No such data" })
        };

        //--------create token ----------------------------------------------------------------------------------------------------------------
        let encodeToken = jwt.sign({
            userId: savedData._id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            iat: Math.floor(Date.now() / 1000)
        },
            "group25")
        return res.status(200).send({ status: true, message: 'Success', data: encodeToken })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createUser = createUser
module.exports.loginUser = loginUser