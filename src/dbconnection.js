const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user")
const app = express();
const validateRequestBody = require("./utils/helper")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
const { userAuth } = require("./auth")

app.use(express.json()) //middleware to convert req.body to javascript object
app.use(cookieParser()) // middlewarw to get the cookies from the request 

// post user data to db
app.post("/signup", async (req, res) => {

    try {
        // validate the req body - create a helper function
        validateRequestBody(req.body);

        const { firstName, lastName, emailId, password } = req.body;

        // encrypt password using bcrypt library
        const passwordHash = await bcrypt.hash(password, 10)

        // Create an new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })

        await user.save();
        res.send("User Added successfully")
    }
    catch (err) {
        res.status(400).send("Error addding user - " + err.message)
    }
})

// user login
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // check whether email id is present in DB
        const user = await User.findOne({ emailId: emailId });

        if (!user) throw new Error("Invalid credentials");

        // check the password entered match which is in db[hashed password]
        // used schema methods to offload the validate password
        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {
            // used schema methods to offload the sign jwt logic
            const token = await user.getJwtToken();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            })
            res.send("Login sucessful.")
        }
        else throw new Error("Invalid credentials");

    }
    catch (err) {
        res.status(400).send("Error addding user - " + err.message)
    }

})

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Error addding user - " + err.message)
    }
})

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
