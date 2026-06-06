const express = require("express");
const server = express();

console.log("Server restarted at", new Date());

// get call with query paramas
server.get("/test", (req, res) => {
    console.log(req.query, "query")
    res.send("Get Testing");
});

// post call with dynamic params
server.post("/test/:userId", (req, res) => {
    console.log(req.params, "params")
    res.send("Post testing!");
});
// put request
server.put("/test", (req, res) => {
    res.send("Put testing!");
});

// delete request
server.delete("/test", (req, res) => {
    res.send("Delete testing!");
});

// use works same for get and post
server.use("/hello", (req, res) => {
    res.send("Hello from hello");
});

// Order matters a lot
server.use("/", (req, res) => {
    res.send("Home!");
});

server.listen(7777, () => {
    console.log("Server is listening");
});