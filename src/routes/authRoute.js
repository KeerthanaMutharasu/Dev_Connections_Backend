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

        const { firstName, lastName, emailId, password, about, age, gender } = req.body;

        // encrypt password using bcrypt library
        const passwordHash = await bcrypt.hash(password, 10)

        // Create an new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            about: req.body.about ?? "This is a default about section of the user",
            photoUrl: req.body.photoUrl ?? "https://i.pinimg.com/236x/3c/bd/86/3cbd86e0fab831190029fee0ea5bb882.jpg?nii=t"

        })
        const token = await user.getJwtToken();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 1 * 3600000)
        })
        await user.save();
        res.json({
            message: "User Added successfully",
            data: user
        })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// user login
authRoute.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        // check whether email id is present in DB
        const user = await User.findOne({ emailId: emailId });
        if (!user) res.status(400).json({ message: "Invalid credentials" });
        // check the password entered match which is in db[hashed password]
        // used schema methods to offload the validate password
        const isPasswordValid = await user.validatePassword(password)

        if (isPasswordValid) {
            // used schema methods to offload the sign jwt logic
            const token = await user.getJwtToken();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 1 * 3600000)
            })
            res.json({ message: "Login successful", data: user })
        }
        else res.status(400).json({ message: "Invalid credentials" });

    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }

})


// user logout
authRoute.post("/logout", async (req, res) => {
    res.cookie("token", null), {
        expires: new Date(Date.now())
    }
    res.clearCookie("token");
    res.send("Logout Succesful")
})

module.exports = { authRoute }