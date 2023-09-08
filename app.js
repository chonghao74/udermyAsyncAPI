const fs = require("fs");
const url = require("url");
// const bodyparser = require("body-parser");//由於 express version 4.16 已內建 此 (4.18.2)

const express = require('express');

const { default: axios, Axios } = require("axios");
// const { resourceLimits } = require("worker_threads");
const app = express();//執行express 函示-一般做法
//const router = express.Router();//執行expres Router 建議做法

//cors
const cors = require('cors');

//DB
const mongoose = require('mongoose');
// const { Schema } = mongoose;//destroction mongose 中有Schema 參數的物件
const { personSchema } = require("./model/person");

//middleware
// app.use(bodyparser.urlencoded({ extended: true }));//post urlencoded -> type:application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));//post urlencoded -> type:application/x-www-form-urlencoded
//  app.use(bodyparser.json());//post json -> type:application/json
app.use(express.json());//post json -> type:application/json
app.use(express.static("public"));//css, js and other folder position
app.set("view engine", "ejs");//

//create a Schema
// const personSchema = new Schema({
//     name: {
//         type: String,
//         maxlength: [100, "Too Long"],
//         minlength: [1, "Too short"],
//         required: [true, 'Why no name?']
//     },
//     number: {
//         type: Number,
//         min: 1,
//         max: 99,
//         required: [true, 'Why no number?']
//     },
//     age: {
//         type: Number,
//         min: 18,
//         max: 150,
//         required: [true, 'Why no age?']
//     },
//     classname: {
//         type: String,
//         required: [true, 'Why no classname?']
//     }
// });

//mongoose start
mongoose.connect('mongodb://127.0.0.1:27017/school')
    .then(() => {
        console.log("db connect...")
    })
    .catch(e => {
        console.log(`db connect fail ${e}`);
    });

//create a Model for Person
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

//RestFul API
//Get
app.get("/api/students", cors(), async (req, res) => {
    let dbData;

    try {
        dbData = await Person.find({}).exec()
            .then(d => {
                return {
                    status: 200,
                    data: d
                };
            })
            .catch(e => {
                return {
                    status: 401,
                    data: e
                };
            });
    }
    catch (e) {
        dbData = {
            status: 6999,
            data: e
        };
    }

    res.send(dbData);

})

app.get("/api/students/name/:nameData", async (req, res) => {
    let { nameData } = req.params;
    let dbData;

    try {

        dbData = await Person.find({ name: nameData }).exec()
            .then(d => {
                return {
                    status: 200,
                    data: d
                };
            })
            .catch(e => {
                return {
                    status: 401,
                    data: e
                };
            });
    }
    catch (e) {
        dbData = {
            status: 6999,
            data: e
        };
    }

    res.send(dbData);
});

app.get("/api/students/name", async (req, res) => {
    let { name } = req.body;
    let dbData;

    try {
        dbData = await Person.find({ name: name }).exec()
            .then(d => {
                return {
                    status: 200,
                    data: d
                };
            })
            .catch(e => {
                return {
                    status: 401,
                    data: e
                };
            });

    }
    catch (e) {
        dbData = {
            status: 6999,
            data: e
        };
    }

    res.send(dbData);
});

//Post
app.post("/api/students", express.json(), async (req, res) => {
    let { name, number, age, classname } = req.body;
    const insertData = { name: name, number: number, age: age, classname: classname };
    console.log("POST endPoint /api/students ");
    const dbData = await Person.insertMany(insertData)
        .then(d => {
            return {
                status: 200,
                data: d
            };
        })
        .catch(e => {
            return {
                status: 501,
                data: e
            };
        })

    res.send(dbData);
});

//Delete
app.delete("/api/students/name/:name", async (req, res) => {
    let { name } = req.params;
    console.log("Delete endPoint /api/students/name/:name " + name);

    await deleteAllDataByName(res, name);
});

app.delete("/api/students/name/", async (req, res) => {
    let { name, type } = req.body;
    switch (type) {
        case "All":
            console.log("Delete Many endPoint /api/students/name " + name);
            await deleteAllDataByName(res, name);
            break;
        case "One":
            console.log("Delete One endPoint /api/students/name " + name);
            await deleteOneDataByName(res, name);
            break;
        default:
            console.log("Delete Many endPoint /api/students/name :property Error");
            dbData = {
                status: 401,
                data: "Property Error"
            };
            res.send(dbData);
            break;
    }
});

function deleteAllDataByName(res, name) {
    try {
        Person.deleteMany({ name: name }).exec()
            .then(d => {
                dbData = {
                    status: 200,
                    data: d
                };
                res.send(dbData);
            })
            .catch * (e => {
                dbData = {
                    status: 401,
                    data: e
                };
                res.send(dbData);
            });
    }
    catch (e) {
        dbData = {
            status: 6999,
            data: e
        };
        res.send(dbData);
    }

}

function deleteOneDataByName(res, name) {
    try {
        Person.deleteOne({ name: name })
            .then(d => {
                dbData = {
                    status: 200,
                    data: d
                };
                res.send(dbData);
            })
            .catch * (e => {
                dbData = {
                    status: 401,
                    data: e
                };
                res.send(dbData);
            });
    }
    catch (e) {
        dbData = {
            status: 6999,
            data: e
        };
        res.send(dbData);
    }
}

//Put
app.put("/api/students", async (req, res) => {
    let { name, number, age, classname } = req.body;
    let dbData;
    //basic
    // const filter = {name: name};
    // const update = {name: name, number:number, age:age, classname:classname};
    //進階照著 欄位順序
    const filter = { name };
    const update = { name, number, age, classname };

    console.log(classname);
    //若使用 updateOne 因為沒法設定 Schema 驗整，故只能自行寫 判斷式子
    /*
    if (name != null && number != null && age != null && classname != null) {
        console.log("(updateOne )Put endPoint /api/students");

        
        dbData = await Person.updateOne({ name: name }, { name: name, number: number, age: age, classname: classname })
            .then(d => {
                console.log(d);
                return {
                    status: 200,
                    data: d
                };
            })
            .catch(e => {
                console.log(e);
                return {
                    status: 501,
                    data: e
                };
            })
    }
    else {
        console.log("(updateOne )Put endPoint /api/students :property Error");
        dbData = {
            status: 401,
            data: "Property Error"
        };
    }
    */

    //if used findOneAndUpdate, it can use option for validator, overwrite
    console.log("(findOneAndUpdate )Put endPoint /api/students");

    try {
        dbData = await Person.findOneAndUpdate(
            filter,
            update,
            { new: true, runValidators: true, overwrite: true }).exec()
            .then(d => {
                console.log(d);
                return {
                    status: 200,
                    data: d
                };
            })
            .catch(e => {
                console.log(e);
                return {
                    status: 401,
                    data: e
                };
            })
    }
    catch (e) {
        console.log("(findOneAndUpdate)Put endPoint /api/students :property Error");
        dbData = {
            status: 6999,
            data: e
        };
    }

    res.send(dbData);
});

//Patch
app.patch("/api/students/:_id", async (req, res) => {
    let dbData;
    console.log(req.params._id.trim());

    if (!req.params._id.trim()) {
        dbData = {
            status: 6999,
            data: "_id is empty String "
        };
    }
    else {
        console.log("false");
        let filter = req.params;
        let update = req.body;


        console.log("(findOneAndUpdate )Patch endPoint /api/students");
        try {
            dbData = await Person.findOneAndUpdate(
                filter,
                update,
                { new: true, runValidators: true }).exec()
                .then(d => {
                    //console.log(d);
                    return {
                        status: 200,
                        data: d
                    };
                })
                .catch(e => {
                    //console.log(e);
                    return {
                        status: 401,
                        data: e
                    };
                })
        }
        catch (e) {
            console.log("(findOneAndUpdate)Patch endPoint /api/students :property Error");
            dbData = {
                status: 6999,
                data: e
            };
        }
    }

    res.send(dbData);
});


app.get("/*", (req, res) => {
    res.render("error");
});


app.listen(3001, () => {
    console.log("port 3001 is Running!!!");
})
