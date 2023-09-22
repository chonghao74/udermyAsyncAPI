const fs = require("fs");
const url = require("url");
const express = require('express');
const { default: axios, Axios } = require("axios");
const app = express();//執行express 函示-一般做法

//import routes
const studentRoutes = require("./routes/student-routes");

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

app.set("view engine", "ejs");//

//mongoose start
// mongoose.connect('mongodb://127.0.0.1:27017/school')
//     .then(() => {
//         console.log("db connect...")
//     })
//     .catch(e => {
//         console.log(`db connect fail ${e}`);
//     });

//create a Model for Person
// const Person = mongoose.model('person', personSchema, 'person');


//Person Data
app.get("/person", async (req, res) => {
    let numberData;
    let datas;
    await Person.findOne({ number: req.query.number })
        .then(d => {
            console.log(d);
            numberData = d;
        })
        .catch(e => {
            console.log(e);
        });

    await Person.find({ number: req.query.number })
        .then(d => {
            // console.log(d);
            datas = d;
        })
        .catch(e => {
            console.log(e);
        });

    res.render("person", { numberData, datas });
})



app.get("/xmlhttprequestgetapi/:city", async (req, res) => {
    let { city } = req.params;

    if (city == null) {
        city = "London";
    }

    const dataUrl = `https://api.weatherapi.com/v1/current.json?key=2e7758f384d64736b06154338232208&q=${city}&aqi=no`;

});

app.get("/fetchgetapi/:city", async (req, res) => {
    let { city } = req.params;

    if (city == null) {
        city = "London";
    }

    const dataUrl = `https://api.weatherapi.com/v1/current.json?key=2e7758f384d64736b06154338232208&q=${city}&aqi=no`;

    let resData = await fetch(dataUrl, { method: 'GET' }).then(res => {
        return res.json();
    }).catch(e => {
        return e;
    });

    // console.log(resData);
    res.send(resData);
});

app.get("/axiosgetapi/:city", async (req, res) => {
    let { city } = req.params;
    if (city == null) {
        city = "London";
    }

    //url
    const baseURL = "https://api.weatherapi.com/v1/current.json";
    //作法1
    // const dataUrl = `${baseURL}?key=2e7758f384d64736b06154338232208&q=${city}&aqi=no`;
    // console.log(dataUrl);
    // let resData = await axios.get(dataUrl)
    //     .then(res => { return res.data })
    //     .catch(e => { return e })
    //     .finally(console.log("Axios GO1"));

    //作法2
    const parameterData = { params: { key: "2e7758f384d64736b06154338232208", q: city, api: "no" } }
    let resData = await axios.get(baseURL, parameterData)
        .then(res => { return res.data })
        .catch(e => { return e })
        .finally(console.log("Axios GO2"));


    res.send(resData);

});


app.get("/*", (req, res) => {
    return res.render("error");
});


app.listen(3001, () => {
    console.log("port 3001 is Running!!!");
})
