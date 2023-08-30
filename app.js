const fs = require("fs");
const url = require("url");
const bodyparser = require("body-parser");

const express = require('express');
const mongoose = require('mongoose');
const { default: axios } = require("axios");
const { Schema } = mongoose;//destroction mongose 中有Schema 參數的物件
const app = express();//執行express 函示

//middleware
app.use(bodyparser.urlencoded({ extended: true }));//post urlencoded
app.use(express.static("public"));//css, js and other folder position
app.set("view engine", "ejs");//

//create a Schema
const personSchema = new Schema({
    name: {
        type: String,
        maxlength: [100, "Too Long"],
        minlength: [1, "Too short"],
        required: [true, 'Why no name?']
    },
    number: {
        type: Number,
        min: 1,
        max: 99,
        required: [true, 'Why no number?']
    },
    age: {
        type: Number,
        min: 18,
        max: 150,
        required: [true, 'Why no age?']
    },
    classname: { type: String }
});

//mongoose start
mongoose.connect('mongodb://127.0.0.1:27017/school')
    .then(() => {
        console.log("db connect...")
    })
    .catch(e => {
        console.log(`db connect fail ${e}`);
    });

//create a Model for Student
const Person = mongoose.model('person', personSchema, 'person');


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
    let urlObj = url.parse(req.url, true);  //拆解url
    switch (urlObj.pathname) {
        case '/axiosgetapi':
            console.log(urlObj.pathname);
            // res.redirect('/axiosgetapi/London');
            res.redirect('/index.html');
            break;
        default:
            res.render("error");
            break
    }

});


app.listen(3001, () => {
    console.log("port 3001 is Running!!!");
})
