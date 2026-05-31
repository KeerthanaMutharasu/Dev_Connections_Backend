const jwt = require("jsonwebtoken");
const User = require("./models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        console.log(token)
        if (!token) {
            throw new Error("Token invalid.")
        }
        const decoded = await jwt.verify(token, "DEVCONNECT#123");
        const { _id } = decoded;

        if (!_id) {
            throw new Error("User doestn't exist.")
        }
        const user = await User.findById(_id);

        req.user = user;
        next();
    }
    catch (err) {
        res.status(400).send("Bad request - " + err.message)
    }
}



module.exports = { userAuth }