const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String
    },
    phoneNumber:{
        type:Number
    },
    email_id:{
        type:String
    },
    address:{
        type:String
    }
}, {timestamps : true})

module.exports = mongoose.model('contactDetail',contactSchema)