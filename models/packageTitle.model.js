const mongoose = require('mongoose');

const packageTitleSchema = new mongoose.Schema({
    packageTitle:{
        type:String,
        required:[true,"Please add Package Title"]
    },
    packages:{
        type:[String],
        required:[true,"Please Add Packages"]
    },
    packagesQuantity:{
        type:Number
    }
})

module.exports = mongoose.model('packageTitleDetail',packageTitleSchema);