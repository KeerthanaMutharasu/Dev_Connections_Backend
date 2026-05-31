const express = require("express");

const authRoute = express.Router();
const { validateRequestBody } = require("../utils/helper")
const bcrypt = require("bcrypt");
const User = require("../models/user")

// post user data to db
authRoute.post("/signup", async (req, res) => {
    try {
        // validate the req body - create a helper function
        validateRequestBody(req.body);

        const { firstName, lastName, emailId, password } = req.body;

        // encrypt password using bcrypt library
        const passwordHash = await bcrypt.hash(password, 10)

        // Create an new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })

        await user.save();
        res.send("User Added successfully")
    }
    catch (err) {
        res.status(400).send("Error addding user - " + err.message)
    }
})

// user login
authRoute.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // check whether email id is present in DB
        const user = await User.findOne({ emailId: emailId });

        if (!user) throw new Error("Invalid credentials");

        // check the password entered match which is in db[hashed password]
        // used schema methods to offload the validate password
        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {
            // used schema methods to offload the sign jwt logic
            const token = await user.getJwtToken();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            })
            res.send("Login sucessful.")
        }
        else throw new Error("Invalid credentials");

    }
    catch (err) {
        res.status(400).send("Error addding user - " + err.message)
    }

})


// user logout
authRoute.post("/logout", async (req, res) => {
    res.cookie("token", null), {
        expires: new Date(Date.now())
    }
    res.send("Logout Succesful")
})

module.exports = { authRoute }