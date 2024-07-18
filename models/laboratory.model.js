const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    testNo: {
        type: Number
    },
    TestName: {
        type: String
    },
    Price: {
        type: Number
    },
    DiscountPercentage: {
        type: Number
    },
    DiscountPrice: {
        type: Number
    }
});

const LaboratorySchema = new mongoose.Schema({
    RepresentedName: {
        type: String,
    },
    LabName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    discountPercentage: {
        type: Number,
    },
    LabPassword: {
        type: String,
        trim: true,
    },
    PhoneNumber: {
        type: Number,
    },
    RepresentedPhoneNumber: {
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
    Longitude: {
        type: String,
    },
    Latitude: {
        type: String,
    },
    tests: [testSchema]
});

module.exports = mongoose.model('LaboratoryDetail', LaboratorySchema);
