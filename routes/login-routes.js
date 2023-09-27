const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { loginSchema } = require("../models/login");

router.use(express.urlencoded({ extended: true }));
// router.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/school')
    .then(() => {
        console.log("db (accounts) connect...")
    })
    .catch(e => {
        console.log(`db (accounts) connect fail ${e}`);
    });

//create a Model for Student
const Login = mongoose.model('accounts', loginSchema, 'accounts');

function checkEmail(input) {
    if (input != null) {
        const inputData = new String(input)
        if (inputData.length > 10) {
            return true;
        }
    }

    return false;

}

router.get("/",
    (req, res, next) => {

        const { account, password } = req.body;
        if (checkEmail(account)) {
            next();
        }
        else {
            res.send({
                status: 7001,
                data: "non email"
            })
        }
    },
    async (req, res) => {
        const { account, password } = req.body;
        try {
            const result = await Login.findOne({ account: account }).exec()
                .then(d => {
                    if (d === null) {
                        return {
                            status: 201,
                            data: "無此帳號"
                        }
                    }
                    else {
                        if (password !== d.password) {
                            return {
                                status: 202,
                                data: "密碼錯誤"
                            }
                        } else {
                            return {
                                status: 200,
                                data: "Login Success"
                            }
                        }
                    }
                })
                .catch(e => {
                    return {
                        status: 401,
                        data: e
                    }
                });

            return res.send(result);
        }
        catch (e) {
            return res.send({
                status: 7099,
                data: e
            })
        }
    });


module.exports = router;