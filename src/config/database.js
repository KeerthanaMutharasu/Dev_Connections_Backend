const mongoose = require("mongoose");

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://mymongocluster:auw4BCQklnPLNLSZ@mymongocluster.ogwjlvv.mongodb.net/devConnection")
}

module.exports = connectDb;




