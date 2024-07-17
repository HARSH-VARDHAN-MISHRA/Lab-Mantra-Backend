const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    packageName:{
        type:String,
        required:[true,"Please add Package Name"]
    },
    laboratoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"LaboratoryDetail"
    },
    laboratoryBranchId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"LaboratoryBranchDetail"
    },
    testCategoryId:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"testCategoryDetail",
        required:[true,"Please add Test Category"]
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