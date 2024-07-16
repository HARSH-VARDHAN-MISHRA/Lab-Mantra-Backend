const mongoose = require('mongoose');

const MiniCartSchema = new mongoose.Schema({
    actualPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    offPercentage: { type: Number, required: true },
    packageName: { type: String, required: true },
    testCategoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestCategory' }],
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    discount: { type: Number, default: 0 },
    homeCollectionCharges: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    totalToPay: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
    CartDetails: [MiniCartSchema],
    patientDetails: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        optionalPhone: { type: String },
        email: { type: String, required: true },
        date: { type: Date, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
        pinCode: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        labName: { type: String, required: true },
        labAddress: { type: String, required: true },
        appointTime: { type: String, required: true },
        bookingType: { type: String, required: true }
    },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    PaymentMode: { type: String, required: true },
    PaymentDone: { type: Boolean, default: false },
    PaymentOrderId: { type: String, required: true }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
