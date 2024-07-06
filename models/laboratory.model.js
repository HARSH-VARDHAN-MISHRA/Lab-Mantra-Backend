// models/laboratory.model.js

const mongoose = require('mongoose');

const LaboratorySchema = new mongoose.Schema({
    RepresentedName:{
        type: String,
        // required: true,
    },
    LabName: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    PhoneNumber:{
        type: Number,
        // required: true,
    },
    RepresentedPhoneNumber:{
        type: Number,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pinCode: {
        type: String,
        required: true,
    },
    Longitude:{
        type: String,
       
    },
    Latitude:{
        type: String,
       
    }
   
    
});


module.exports = mongoose.model('LaboratoryDetail', LaboratorySchema);
