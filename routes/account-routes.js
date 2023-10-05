const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { accountSchema } = require("../models/account");
const bcrypt = require('bcrypt');
const saltRounds = 10;


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
const Account = mongoose.model('accounts', accountSchema, 'accounts');

function validateEmail(input) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (input) {
        if (String(input).toLowerCase().match(validRegex)) {
            return true;
        }
    }

    return false;
}

function validateEmailMiddleware(req, res, next) {
    const { account } = req.body;
    if (validateEmail(account)) {
        next();
    }
    else {
        res.send({
            status: 7001,
            data: "non email"
        })
    }

}

function validatePasswordMiddleware(req, res, next) {
    const { password } = req.body;
    console.log(password);
    if (password) {
        if (String(password).length >= 9) {
            next();
        }
        else {
            res.send({
                status: 7003,
                data: "password 長度不足"
            })
        }
    }
    else {
        res.send({
            status: 7002,
            data: "password is null or empty"
        })
    }
}

// function checkEmail(input) {
//     if (input != null) {
//         const inputData = new String(input)
//         if (inputData.length > 10) {
//             return true;
//         }
//     }

//     return false;

// }

router.post("/login",
    validateEmailMiddleware,
    async (req, res) => {
        const { account, password } = req.body;
        try {
            const result = await Account.findOne({ account: account }).exec()
                .then(d => {
                    if (d === null) {
                        return {
                            status: 201,
                            data: "無此帳號"
                        }
                    }
                    else {
                        return bcrypt.compare(password, d.password).then(result => {
                            if (result) {
                                return {
                                    status: 200,
                                    data: "Login Success"
                                }

                            } else {
                                return {
                                    status: 202,
                                    data: "密碼錯誤"
                                }
                            }
                        }).catch(e => {
                            return {
                                status: 401,
                                data: e
                            }
                        });
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

router.post("/signup",
    validateEmailMiddleware,
    validatePasswordMiddleware,
    async (req, res) => {
        const { account, password } = req.body;
        try {
            const result = await Account.findOne({ account: account });

            if (!result) {
                try {
                    const hashValue = await bcrypt.hash(password, saltRounds);
                    // const hashValue = bcrypt.hashSync(password, saltRounds);
                    // const hashValue2 = await bcrypt.hash(password, saltRounds).then(hash => {
                    //     return hash;
                    // })
                    //     .catch(e => {
                    //         return e;
                    //     });

                    // console.log(`hashValue : ${hashValue}`);
                    // console.log(`hashValue2 : ${hashValue2}`);


                    const result = await Account.insertMany({ account: account, password: hashValue })
                        .then(d => {
                            return {
                                status: 200,
                                data: d
                            }
                        })
                        .catch(e => {
                            return {
                                status: 401,
                                data: e
                            }
                        })
                    return res.send(result);
                }
                catch (e) {
                    return res.send({
                        status: 7081,
                        data: e
                    })
                }
            }
            else {
                return res.send({
                    status: 201,
                    data: "帳號已經存在"
                })
            }
        }
        catch (e) {
            return res.send({
                status: 7080,
                data: e
            })
        }
    });

module.exports = router;