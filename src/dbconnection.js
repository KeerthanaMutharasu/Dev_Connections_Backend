const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user")
const app = express();

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Keerthana",
        lastName: "Mutharasu",
        emailId: "kem@gmail.com",
        password: "test#124"
    }
    // Create an new instance of the User model
    const user = new User(userObj)
    try {
        await user.save();
        res.send("User Added successfully")
    }
    catch (err) {
        res.status(400).send("Error addding user")
    }
})

connectDb().then(() => {
    console.log("DB connected")
    app.listen("7777", () => {
        console.log("App is listening...")
    })
}).catch((err) => console.log(err))
