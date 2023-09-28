const mongoose = require('mongoose');
const { Schema } = mongoose;//destroction mongose 中有 Schema 參數的物件

const accountSchema = new Schema({
    account: {
        type: String,
        maxlength: [50, "Too Long"],
        minlength: [10, "Too short"],
        required: [true, 'Why no account?']
    },
    password: {
        type: String,
        maxlength: 9,
        minlength: 30,
        required: [true, 'Why no password?']
    }
});


module.exports.accountSchema = accountSchema;