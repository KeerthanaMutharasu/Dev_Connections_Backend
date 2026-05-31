const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user")
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")

const { authRoute } = require("./routes/authRoute");
const { profileRoute } = require("./routes/profileRoute");
const { connectionRequestRoute } = require("./routes/connectionRequestRoute");

app.use(express.json()) //middleware to convert req.body to javascript object
app.use(cookieParser()) // middleware to get the cookies from the request 

app.use("/", authRoute)   //if no route matched it will go to profile route
app.use("/", profileRoute)
app.use("/", connectionRequestRoute)

// get all users from db
app.get("/feed", async (req, res) => {
    const users = await User.find({})
    try {
        if (users.length === 0) {
            res.status(404).send("No user found.")
        }
        else res.send(users)
    }
    catch (err) {
        res.status(400).send("Something went wrong.")
    }
}
)

// get one user based on a value from db
app.get("/user", async (req, res) => {
    try {
        // can also use find({ emailId: req.body.emailId }) - return array of users with same emailid
        const user = await User.findOne({ emailId: req.body.emailId })
        if (!user) {
            res.status(404).send("No user found")
        }
        else {
            res.send(user)
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// delete using findByIdAndDelete(id) - can also be findByIdAndDelete({_id: userId})
app.delete("/user/:userId", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.send("User deleted successfully")
    }
    catch (err) {
        res.status(400).send("Something went worng.")
    }
})

// update user data
app.patch("/user/:userId", async (req, res) => {

    try {
        const ALLOWED_KEYS = ["firstName", "lastName", "age", "skills", "photoUrl"];
        const isUpdateAllowed = Object.keys(req.body).every((k) => ALLOWED_KEYS.includes(k)
        )
        if (!isUpdateAllowed) throw new Error("Update not allowed for this field.")
        await User.findByIdAndUpdate(req.params.userId, req.body, {
            returnDocument: "after",
            runValidators: true
        });
        res.send("User updated successfully")
    }
    catch (err) {
        res.status(400).send("Something went wrong - " + err.message)
    }
})

connectDb().then(() => {
    console.log("DB connected")
    app.listen("7777", () => {
        console.log("App is listening...")
    })
}).catch((err) => console.log(err))
