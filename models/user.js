"use strict";
const mongoose = require('mongoose');

let User = new mongoose.Schema({

    username : {
        type : String,
        required : true
    },
    name : {
        type: String,
        required:true,
        trim:true
    },
    location: {
        country:{
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
        },
        coordinates: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        }
    },
    
    isWalker: {
        type: Boolean,
        required:true,
    }

});

module.exports = mongoose.model('User', User);
