const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 20
    },
    emailId: {
        type: String,
        required: true,
        unique: true,   //two users should not have same email id
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid.")
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password.")
            }
        }
    },
    age: {
        type: String,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not allowed")
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo Url not valid.")
            }
        },
        default: "https://www.bing.com/images/search?view=detailV2&ccid=i50UjYMc&id=6A821661A9253FFFF135FF3C143F2BA7A7978F95&thid=OIP.i50UjYMcMwLKqutTKZmoqgHaHa&mediaurl=https%3a%2f%2fi.pinimg.com%2foriginals%2f0f%2f69%2f1c%2f0f691cd77a8c6d90f07b35c10c95668f.jpg&exph=4096&expw=4096&q=empty+man+dp&FORM=IRPRST&ck=0965C56E9AEF1A7014FDF0C8E7EEF62D&selectedIndex=2&itb=0"
    },
    skills: {
        type: [String],
        validate: {
            validator: (value) => {
                return value.length <= 10
            },
            message: "Cannot enter more than 10 skills"
        }
    }
},
    {
        timestamps: true
    })

// do not use arrow function otherwise this wont work
userSchema.methods.getJwtToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEVCONNECT#123", {
        expiresIn: "1h"
    })
    return token;
}

// do not use arrow function otherwise this wont work
userSchema.methods.validatePassword = async function (passworsInputByUser) {
    const user = this;
    const passwordHashInDb = user.password;
    const isPasswordValid = bcrypt.compare(passworsInputByUser, passwordHashInDb)
    return isPasswordValid;
}

// can also be implemented as below
// module.exports = mongoose.model("User", userSchema);

const User = mongoose.model("User", userSchema);
module.exports = User
