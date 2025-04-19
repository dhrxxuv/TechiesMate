const validator = require('validator')

const validateSignupdata = (req)=>{
    const {firstName,lastName,emailId,password,age} = req.body;
    if(!firstName||!lastName){
        throw new Error('Name not Valid')
    }
    else if(firstName.length<2){
        throw new Error('Name should be at least 2 characters long')
    }
    if(!password){
        throw new Error('Password not Valid')
    }
    if(age<18){
        throw new Error('Age not Valid')
    }
    if(!validator.isEmail(emailId)){
        throw new Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw new Error('Password is not strong')
    }
    
}


const validateProfileData = (req) => {
    const allowedEditFields = ["lastName", "firstName", "gender", "age", "about", "skills", "password"];
    return Object.keys(req.body).every(field => allowedEditFields.includes(field));
};


module.exports = {validateSignupdata,
    validateProfileData}