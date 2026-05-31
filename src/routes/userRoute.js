
const express = require("express");

const userRoute = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest")
const { userAuth } = require("../auth");
const User = require("../models/user");

const SELECTEDFIELDS = "firstName lastName skills photoUrl about";

userRoute.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const userId = loggedInUser._id;

        const data = await ConnectionRequestModel.find({
            status: "interested",
            toUserId: userId
        }).populate("fromUserId", "firstName lastName skills")

        if (!data) {
            return res.json({
                message: "No connection request"
            })
        }

        res.json({
            message: "Data fetched successfully",
            data
        })

    }
    catch (err) {
        res.json({
            message: err.message
        })
    }
}
)

userRoute.get("/user/connections", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const userId = loggedInUser._id;

        const data = await ConnectionRequestModel.find({
            $or: [
                {
                    fromUserId: userId, status: "accepted",
                }, {
                    toUserId: userId, status: "accepted"
                }
            ]
        }).populate("fromUserId", "firstName lastName skills").populate("fromUserId", "firstName lastName skills")

        if (!data) {
            return res.json({
                message: "No connection request"
            })
        }

        const fromUserData = data.map((row) => row.fromUserId._id.toString()
            === loggedInUser._id.toString() ? row.toUserId : row.fromUserId
        )

        res.json({
            message: "Data fetched successfully",
            data: fromUserData
        })
    }
    catch (err) {
        res.json({
            message: err.message
        })
    }

})

userRoute.get("/feed", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const notallowedStatus = ["interested", "accepted", "rejected", "ignored"];

        const connectRequestUsers = await ConnectionRequestModel.find({
            $or: [{
                fromUserId: loggedInUser._id
            }, {
                toUserId: loggedInUser._id
            }
            ]
            ,
        }).select("fromUserId toUserId");

        // contains only ids that has any connection with the loggedin user and that needs to be hidden
        const hideRequestUsers = new Set();
        connectRequestUsers.forEach((user) => {
            hideRequestUsers.add(user.fromUserId.toString());
            hideRequestUsers.add(user.toUserId.toString());
        })

        const users = await User.find({
            $and: [{ _id: { $nin: Array.from(hideRequestUsers) } },
            { _id: { $ne: loggedInUser._id } }
            ]
        }).select(SELECTEDFIELDS)

        if (!users.length) {
            return res.json({
                message: "No feed data",
            })
        }

        res.json({
            message: "Feed fetched succesfully",
            data: users
        })

    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

module.exports = { userRoute }