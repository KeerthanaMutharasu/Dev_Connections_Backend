const adminAuth = (req, res, next) => {
    const token = "x098yz"
    if (token === "xyz") {
        next();
    }
    else {
        res.send("User not authenticated")
    }
}

const userAuth = (req, res, next) => {
    const token = "xy778z"
    if (token === "xyz") {
        next();
    }
    else {
        res.send("User not authenticated")
    }
}

module.exports = { adminAuth, userAuth }