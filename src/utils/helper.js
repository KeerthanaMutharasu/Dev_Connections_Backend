const validator = require("validator");

const validateRequestBody = (requestBody) => {
    const { firstName, emailId, password } = requestBody;

    if (!firstName || !emailId || !password) {
        throw new Error("Missing fields.")
    }

    else if (firstName.length < 4 || firstName.length > 40) {
        throw new Error("Entered firstname should be greater than 4 or less than 40 characters.")
    }

    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password.")
    }
}

const validateProfileUpdateRequest = (req) => {
    const ALLOWED_FIELDS = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills", "password"];

    const isUpdateAllowed = Object.keys(req.body).every((field) => ALLOWED_FIELDS.includes(field))

    return isUpdateAllowed;

}

const validatePasswordRequest = (req) => {
    if (!req.body.password) throw new Error("No password field present.")

    const isPasswordValidForUpdate = validator.isStrongPassword(req.body.password)
    return isPasswordValidForUpdate;
}

module.exports = { validateRequestBody, validateProfileUpdateRequest, validatePasswordRequest }