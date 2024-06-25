const mongoose = require('mongoose');

const testCategorySchema = new mongoose.Schema({
    testCategoryName:{
        type:String,
        required:[true,"Please fill the Test Category Name"]
    },
    testId:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"TestDetail",
        required:[true,"Please add tests"]
    },
    testNumber:{
        type:Number,
    }
})

module.exports = mongoose.model('testCategoryDetail',testCategorySchema);