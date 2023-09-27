const express = require('express');
const router = express.Router();
//cors
const cors = require('cors');
//DB nosql(Mongo)
const mongoose = require('mongoose');
// const { Schema } = mongoose;//destroction mongose 中有Schema 參數的物件
const { studentSchema } = require("../models/student");

//middleware
router.use(express.json());//post json -> type:application/json
router.use(express.static("public"));//css, js and other folder position
router.use((req, res, next) => {
    console.log("I am router students middleware !");
    if (true) {
        next();
    }
    else {
        res.redirect("https://google.com");
    }
});

//mongoose 
//connect
mongoose.connect('mongodb://127.0.0.1:27017/school')
    .then(() => {
        console.log("db (students) connect...")
    })
    .catch(e => {
        console.log(`db (students) connect fail ${e}`);
    });

//create a Model for Student
const Student = mongoose.model('students', studentSchema, 'students');

//RestFul API
//Get
router.get("/", cors(), async (req, res) => {
    let dbData;

    try {
        dbData = await Student.find({}).exec()
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

router.get("/name/:nameData", async (req, res) => {
    let { nameData } = req.params;
    let dbData;

    try {

        dbData = await Student.find({ name: nameData }).exec()
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

router.get("/name", async (req, res) => {
    let { name } = req.body;
    let dbData;

    try {
        dbData = await Student.find({ name: name }).exec()
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
router.post("/", express.json(), async (req, res) => {
    let { name, number, age, classname } = req.body;
    const insertData = { name: name, number: number, age: age, classname: classname };
    console.log("POST endPoint /api/students ");
    const dbData = await Student.insertMany(insertData)
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
router.delete("/api/students/name/:name", async (req, res) => {
    let { name } = req.params;
    console.log("Delete endPoint /api/students/name/:name " + name);

    await deleteAllDataByName(res, name);
});

router.delete("/api/students/name/", async (req, res) => {
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
        Student.deleteMany({ name: name }).exec()
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
        Student.deleteOne({ name: name })
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
router.put("/api/students", async (req, res) => {
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

        
        dbData = await Student.updateOne({ name: name }, { name: name, number: number, age: age, classname: classname })
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
        dbData = await Student.findOneAndUpdate(
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
router.patch("/api/students/:_id", async (req, res) => {
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
            dbData = await Student.findOneAndUpdate(
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


module.exports = router;