const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    labName: {
        type: String,
        required: true
    },
    labAddress: {
        type: String,
        required: true
    },
    labEmail: {
        type: String,
        required: true
    },
    labId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'LaboratoryDetail',
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    optionalPhone: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    appointTime: {
        type: String,
        required: true
    },address:{
        type: String,
    },
    bookingType: {
        type: String,
        enum: ['homeCollection', 'labAppointment'],
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    homeCollectionCharges: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    OrderId: String,
    totalToPay: {
        type: Number,
        required: true
    },
    cartDetails: [
        {
            _id: false, // Disable auto _id for subdocuments
            packageName: String,
            testCategoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestCategory' }], // Example ref to another model
            testQuantity: Number,
            testGroupQuantity: Number,
            actualPrice: Number,
            currentPrice: Number,
            offPercentage: Number,
            testDetails: [
                {
                    _id: false, // Disable auto _id for sub-subdocuments
                    testName: String,
                    // Add more fields as needed from testDetails array
                }
            ],
        }
    ],
    testCartDeatil: [
        {
            test_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestDetail' }],
            testName: String,
            actualPrice: Number,
            discountPrice: Number,
            discountPercentage: Number,
        }
    ],
    paymentStatus: {
        type: String,
        default: "Pending",
        enum: ["Success", "Failed", "created", "Cash-Collection", "Pending"]
    },
    transactionId: {
        type: String,
    },
    PaymentMethod: {
        type: String,
    },
    OrderId: {
        type: String,
    },
    PaymentDone: {
        type: Boolean,
        default: false
    },
    PatientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchemaDetails"
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
