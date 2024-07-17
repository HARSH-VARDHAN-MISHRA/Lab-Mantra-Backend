const mongoose = require('mongoose');

const LaboratorySchema = new mongoose.Schema({
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
    discountPercentage:{
        type: String,
    },
    LabPassword:{
        type:String,
        trim: true,
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
    tests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestDetail'
    }]
    
});


module.exports = mongoose.model('LaboratoryDetail', LaboratorySchema);
