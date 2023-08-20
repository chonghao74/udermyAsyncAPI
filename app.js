const fs = require("fs");
const url = require("url");
const bodyparser = require("body-parser");

const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;//destroction mongose 中有Schema 參數的物件
const app = express();//執行express 函示

//middleware
app.use(bodyparser.urlencoded({ extended: true }));//post urlencoded
app.use(express.static("public"));//css position
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

app.get("/*", (req, res) => {

    res.render("error");
});


app.listen(3001, () => {
    console.log("port 3001 is Running!!!");
})
