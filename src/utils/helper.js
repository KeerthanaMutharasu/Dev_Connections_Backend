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

module.exports = validateRequestBody 