const mongoose = require("mongoose");
const User = require("./user")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `VALUE is incorrect in status type`
        }
    }
}, {
    timestamps: true
})

// index = makes query very very even you have billions of data in db - but cannot be used 
// everywhere because it is a complex operation
// is used for optimized search of a data 
// index: true, unique: true
// compound index - can be added for two value search - ascending/descending etc.
// connectionRequestSchema.index({fromUserId: 1, toUserId:  1}) - compound index

// is a middleware that gets called before save is called 
// arrow function should not be used
// not mandatory to write and check this here 

connectionRequestSchema.pre("save", function () {
    const connectionReq = this
    if (connectionReq.fromUserId.equals(connectionReq.toUserId)) {
        throw new Error("Cannot send request to yourself.")
    }
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel