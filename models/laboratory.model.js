// models/laboratory.model.js

const mongoose = require('mongoose');

const LaboratorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    tests: {
        type: [String],
        required: true,
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
});

LaboratorySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('LaboratoryDetail', LaboratorySchema);
