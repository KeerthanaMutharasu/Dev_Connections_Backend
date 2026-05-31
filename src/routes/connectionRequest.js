
const express = require("express");

const connectionRequestRoute = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest")
const { userAuth } = require("../auth");
const User = require("../models/user");

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

        await userData.save()

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


module.exports = { connectionRequestRoute }