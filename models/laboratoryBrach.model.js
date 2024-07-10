const mongoose = require('mongoose');

const LaboratoryBranchSchema = new mongoose.Schema({
    RepresentedName:{
        type: String,
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
    },
    MainLaboratory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'LaboratoryDetail',
        required:true
    }
})

module.exports = mongoose.model('LaboratoryBranchDetail',LaboratoryBranchSchema)