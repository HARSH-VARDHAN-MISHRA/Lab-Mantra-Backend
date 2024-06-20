const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    packageName:{
        type:String,
        required:[true,"Please add Package Name"]
    },
    testCategoryName:{
        type:[String],
    },
    testQuantity:{
        type:Number,
    },
    testGroupQuantity:{
        type:Number
    },
    actualPrice:{
        type:Number,
        required:[true,"Please add Package Price"]
    },
    currentPrice:{
        type:Number
    },
    offPercentage:{
        type:Number
    }    
})

module.exports = mongoose.model('packageDetail',packageSchema);