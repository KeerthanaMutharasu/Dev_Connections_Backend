const express = require("express");
const { userAuth } = require("../auth")
const { validateProfileUpdateRequest, validatePasswordRequest } = require("../utils/helper");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const ConnectionRequestModel = require("../models/connectionRequest");
const { authRoute } = require("./authRoute");
const profileRoute = express.Router();

profileRoute.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.json({
            messsage: "User profile fetched successfully.",
            data: user
        })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

profileRoute.patch("/profile/update", userAuth, async (req, res) => {
    try {
        if (!validateProfileUpdateRequest(req)) {
            throw new Error("Cannot update some fields.")
        }
        const user = req.user;

        // below is also working but logic was done manually
        // const updateUser = await User.findByIdAndUpdate(user._id, req.body, {
        //     returnDocument: "after"
        // })
        const loggedinUser = req.user;
        const updatedUser = Object.keys(req.body).forEach(field => (loggedinUser[field] = req.body[field]))
        await loggedinUser.save();
        res.json({
            message: "Profile updated successfully.",
            data: loggedinUser
        })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

profileRoute.patch("/profile/update/password", userAuth, (req, res) => {
    if (!validatePasswordRequest(req)) {
        throw new Error("Enter a strong passowrd.")
    }

    const passwordHash = bcrypt.hash(req.body.password, 10)

    req.user.password = passwordHash;
    res.json({
        message: "Password Updated successfully.",
        data: req.user
    })
})


module.exports = { profileRoute }