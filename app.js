const fs = require("fs");
const url = require("url");
const bodyparser = require("body-parser");

const express = require('express');
const app = express();

//middleware
app.use(bodyparser.urlencoded({ extended: true }));//post urlencoded
app.use(express.static("public"));//css position
app.set("view engine", "ejs");


app.get("/*", (req, res) => {
    res.render("error");
});


app.listen(3001, () => {
    console.log("port 3001 is Running!!!");
})
