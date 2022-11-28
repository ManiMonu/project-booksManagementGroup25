const userModel = require("../model/userModel")

const phoneRegex = /^[0]?[789]\d{9}$/
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/


const createUser = async function (req, res) {
    let data = req.body;
    let { title, name, phone, email, password } = data;

    if (!title) return res.status(400).send({ status: false, message: "title is not present" })
    if(title != "Mr" && title != "Mrs" && title != "Miss") return res.status(400).send({status : false, message : "Title should be Mr, Mrs or Miss"})

    
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
    res.send({ msg: newData })
}

module.exports.createUser = createUser