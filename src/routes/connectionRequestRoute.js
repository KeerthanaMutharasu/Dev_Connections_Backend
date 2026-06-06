
const express = require("express");

const connectionRequestRoute = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest")
const { userAuth } = require("../auth");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail")

connectionRequestRoute.post("/request/send/:status/:toUserId", userAuth, async (req, res, next) => {
    try {
        const { status, toUserId } = req.params;
        const fromUserId = req.user._id;
        const allowedStatus = ["interested", "ignored"]

        if (!allowedStatus.includes(status)) throw new Error("Status not allowed.")

        const isFromUseridInDB = await User.findById(toUserId)
        if (!isFromUseridInDB) return res.json({
            message: "User does not exist."
        })

        const isConnectionExist = await ConnectionRequestModel.findOne({
            $or: [{
                fromUserId,
                toUserId
            }, {
                fromUserId: toUserId,
                toUserId: fromUserId
            }]
        })
        if (isConnectionExist) return res.json({
            message: "Connection already exist."
        })

        const userData = new ConnectionRequestModel({
            fromUserId, toUserId, status
        })


        await userData.save();

        const emailRes = await sendEmail.run(`New Connection request`,
            `You have got a new connection request from ${req.user.firstName}`
        )
        console.log(emailRes)
        res.json({
            message: "Connection request sent.",
            data: userData
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})


connectionRequestRoute.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {

        const { status, requestId } = req.params;
        const loggedInUser = req.user;
        const AllowedStatus = ["accepted", "rejected"];
        if (!AllowedStatus.includes(status)) throw new Error("Status not allowed.")

        const data = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        })
        if (!data) {
            return res.json({
                message: "Data not found"
            })
        }

        data.status = status;
        await data.save()
        res.json({
            message: "Connected request is " + status + "ed",
            data
        })

    }

    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

})









module.exports = { connectionRequestRoute }