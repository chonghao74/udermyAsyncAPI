const mongoose = require('mongoose');
const { Schema } = mongoose;//destroction mongose 中有Schema 參數的物件

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
    classname: {
        type: String,
        enum: ["A01", "A02"],
        required: [true, 'Why no classname?']
    }
});


module.exports.personSchema = personSchema;