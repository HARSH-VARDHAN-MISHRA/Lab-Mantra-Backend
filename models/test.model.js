const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    testName: {
        type: String,
        required: [true, "Please Add Test Name"]
    },
    actualPrice: {
        type: Number,
        required: [true, "Please fill Price"]
    },
    discountPrice: {
        type: Number,
    },
    discountPercentage: {
        type: Number,
    },
    Branch: [{
        labBranchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LaboratoryBranchDetail'
        },
        HowManyDiscountAppliedForThisLab: {
            type: Number,
        }
    }]
});

module.exports = mongoose.model('TestDetail', testSchema);
