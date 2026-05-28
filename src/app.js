const express = require("express");
const server = express();

console.log("Server restarted at", new Date());

server.use("/test", (req, res) => {
    res.send("Hello from testing!");
});

server.use("/hello", (req, res) => {
    res.send("Hello from hello908");
});

server.listen(7777, () => {
    console.log("Server is listening");
});