const validator = require('validator')

const validateSignupdata = (req) => {
    const { firstName, lastName, emailId, password, age } = req.body;

    if (!firstName || !lastName) {
        throw new Error('Name not Valid');
    } else if (firstName.length < 2) {
        throw new Error('Name should be at least 2 characters long');
    }

    else if (!validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0
    })) {
        throw new Error('Password is not strong enough');
    }

    if (age < 18) {
        throw new Error('Age not Valid');
    }

    if (!validator.isEmail(emailId)) {
        throw new Error('Email is not valid');
    }
};



const validateProfileData = (req) => {
    const allowedEditFields = ["lastName", "firstName", "gender", "age", "about", "skills","photoUrl"];
    return Object.keys(req.body).every(field => allowedEditFields.includes(field));
};


const validationPassword = (req) => {
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
        throw new Error("Both current and new passwords are required");
    }

    if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
    }

    if (password === newPassword) {
        throw new Error("Current and new passwords cannot be the same");
    }

    return true;
};


module.exports = {
    validateSignupdata,
    validateProfileData,
    validationPassword}