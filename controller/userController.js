const userModel = require("../model/userModel")
const jwt = require('jsonwebtoken')
const validator = require('../validator/validator')

//--------------------------|| CREATE USER ||--------------------------------
const createUser = async function (req, res) {
    try {

        let data = req.body;
        if (!validator.requiredInput(data)) return res.status(400).send({ status: false, message: 'Input is required' })
        let { title, name, phone, email, password, address } = data;

        if (!validator.validInput(title)) return res.status(400).send({ status: false, message: "title is not present or valid" })
        if (!["Mr", "Mrs", "Miss"].includes(title)) return res.status(400).send({ status: false, message: "Title should be Mr, Mrs or Miss" })


        if (!validator.validInput(name)) return res.status(400).send({ status: false, message: "Name is not present or valid" })
        if (!validator.validString(name)) return res.status(400).send({ status: false, message: "name is not valid" })

        if (!validator.validInput(phone)) return res.status(400).send({ status: false, message: "Phone is not present or valid" })
        if (!validator.validPhone(phone)) return res.status(400).send({ status: false, message: "phone no is not valid" })
        const isPhonePresent = await userModel.findOne({ phone: phone })
        if (isPhonePresent) return res.status(400).send({ status: false, message: "Phone No already exist" })

        if (!validator.validInput(email)) return res.status(400).send({ status: false, message: "email is not present or valid" })
        if (!validator.validEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        const isEmailPresent = await userModel.findOne({ email: email })
        if (isEmailPresent) return res.status(400).send({ status: false, message: "email already exist" })


        if (!validator.validInput(password)) return res.status(400).send({ status: false, message: "Password is not present or valid" })
        if (!validator.validPassword(password)) return res.status(400).send({ status: false, message: "password should be string, the length should be 8-15 characters" })
        if (address) {
            if (address.street) {
                if (typeof address.street !== 'string' || address.street.trim().length === 0 || !address.street.match(/^[a-zA-Z ]+$/)) return res.status(400).send({ status: false, message: 'Street is not valid' })
            }
            if (address.city) {
                if (typeof address.city !== 'string' || address.city.trim().length === 0 || !address.city.match(/^[a-zA-Z ]+$/)) return res.status(400).send({ status: false, message: 'City is not valid' })
            }
            if (address.pincode) {
                if (typeof address.pincode !== 'string' || address.pincode.trim().length === 0 || !address.pincode.match(/^[\d]{6}$/)) return res.status(400).send({ status: false, message: 'Pincode is not valid' })
            }
        }

        let newData = await userModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: newData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//--------------------------|| LOGIN USER ||--------------------------------


const loginUser = async function (req, res) {

    try {
        const { email, password } = req.body

        if (!validator.requiredInput(req.body)) {
            return res.status(400).send({ status: false, message: "Please provide details for login" })
        };

        if (!validator.validInput(email)) {
            return res.status(400).send({ status: false, message: "email is not present or valid" })
        };


        if (!validator.validInput(password)) {
            return res.status(400).send({ status: false, message: "password is not present or valid" })
        };

        let savedData = await userModel.findOne({ email, password })
        if (!savedData) {
            return res.status(404).send({ status: false, message: "No such data" })
        };

        //--------create token ----------------------------------------------------------------------------------------------------------------
        let encodeToken = jwt.sign({
            userId: savedData._id,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 + 24),
            iat: Math.floor(Date.now() / 1000)
        },
            "group25")
        return res.status(201).send({ status: true, message: 'Success', data: encodeToken })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createUser = createUser
module.exports.loginUser = loginUser