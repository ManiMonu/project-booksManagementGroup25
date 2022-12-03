const requiredInput = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const validInput = function(value){
   if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    if(typeof value !== 'string') return false
    return true
}

const validNumber = function(value){
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === "Number") return false
    return true
}

const validString = function(value){
    return value.match(/^[a-zA-Z ]+$/)
}

const validEmail = function(value){
    return value.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z-]+\.[a-zA-Z-.]+$/)
}

const validPassword = function(value){
    return value.match(/^[A-Za-z]{8,15}$/)
}

const validPhone = function(value){
    return value.match(/^[0]?[789]\d{9}$/)
}

const validISBN = function(value){
    return value.match(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)
}

module.exports = { requiredInput, validInput, validString, validEmail, validPassword, validPhone, validISBN, validNumber }