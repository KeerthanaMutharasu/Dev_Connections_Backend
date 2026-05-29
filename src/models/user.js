const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: String
    },
    gender: {
        type: String
    }
})

// can also be implemented as below
// module.exports = mongoose.model("User", userSchema);

const User = mongoose.model("User", userSchema);
module.exports = User
