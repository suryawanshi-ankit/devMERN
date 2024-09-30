const validator = require('validator');

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password, skills } = req.body;

    if (!firstName || !lastName) throw new Error("Name is not valid !!!");
    else if (!validator.isEmail(emailId)) throw new Error("Email is not valid !!!");
    else if (!validator.isStrongPassword(password)) throw new Error("Please enter strong password !!!");
    else if (skills?.length > 10) throw new Error("Allowed skills is 10 !!!");
}

const validateLoginData = (req) => {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId) || !validator.isStrongPassword(password)) 
        throw new Error("Invalid credentials !!!");
}

const validateEditProfile = (req) => {
    const fieldAllowedToUpdate = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills'];
    return Object.keys(req.body)?.every(key => fieldAllowedToUpdate.includes(key));
}

module.exports = {
    validateSignupData,
    validateLoginData,
    validateEditProfile,
}