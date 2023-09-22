const fs = require("fs");
const url = require("url");
const express = require('express');

const app = express();//執行express 函示-一般做法

//import routes
const studentRoutes = require("./routes/student-routes");
const weatherRoutes = require("./routes/weather-routes");

//cors
const cors = require('cors');

//DB
const mongoose = require('mongoose');
// const { Schema } = mongoose;//destroction mongose 中有Schema 參數的物件
const { personSchema } = require("./models/student");

//middleware
//1.設定 content-type
// app.use(bodyparser.urlencoded({ extended: true }));//post urlencoded -> type:application/x-www-form-urlencoded
app.use(express.json());//post json -> type:application/json
app.use(express.static("public"));//css, js and other folder position
//2.設定 進入任何 routes 前置作業
app.use((req, res, next) => {
    console.log("I am middleware all!!!");

    // 可以寫判斷式來預處理
    // 如果都符合才執行 next 執行所要的 routes
    if (true) {
        next();
    }
    else {
        res.redirect("https://google.com");
    }
});
//3.設定 Routes
app.use('/api/students', studentRoutes);
app.use('/api/weather', weatherRoutes);

//設定 view engine 使用 ejs ，則 render 時就能不寫副檔名
app.set("view engine", "ejs");

app.get("/*", (req, res) => {
    return res.render("error");
});


app.listen(3001, () => {
    console.log("port 3001 is Running!!!");
})
