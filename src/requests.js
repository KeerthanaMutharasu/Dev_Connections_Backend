const express = require("express");
const { adminAuth, userAuth } = require("./auth")

const app = express();

// middleware chaining and Authorized user
app.get("/user/data", userAuth,
    (req, res, next) => {
        console.log("User 2 Success")
        next()
        // res.send("User 2 Success")
    },
    (req, res, next) => {
        console.log("User 3 Success")
        next()
        // res.send("User 3 Success")
    },
    (req, res, next) => {
        console.log("User 4 Success")
        res.send("User 4 Success")
    },
)

// Loginpage
app.post("/user/login", (req, res) => {
    res.send("Logged in")
})

// Authorized Admin
app.use("/admin", adminAuth)

app.get("/admin", (req, res) => {
    res.send("Admin Dashboard");
});

app.get("/admin/getAllData", (req, res, next) => {
    res.send("All Data")
})

app.get("/admin/deleteAllData", (req, res, next) => {
    res.send("Deleted Data")
})


// Error Handling
app.get("/user", (req, res) => {
    try {
        throw new Error("Testing")
        res.send("User Error page")
    }
    catch (err) {
        res.status(400).send("Error handled in path.")
    }
}
)

// better to use common error
app.use("/", (err, req, res, next) => {
    res.send("Handled Common Error.")
})

app.listen(7777, () => {
    console.log("Server is listening....")
})