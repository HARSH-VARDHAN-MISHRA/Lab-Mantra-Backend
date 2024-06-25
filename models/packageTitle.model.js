const mongoose = require('mongoose');

const packageTitleSchema = new mongoose.Schema({
    packageTitle: {
        type: String,
        required: [true, "Please add Package Title"]
    },
    packagesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'packageDetail',
        required: [true, "Please Add Packages"]
    }],
    packagesQuantity: {
        type: Number
    }
});

module.exports = mongoose.model('packageTitleDetail', packageTitleSchema);
