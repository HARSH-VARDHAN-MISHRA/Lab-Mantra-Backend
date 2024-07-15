
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/OrderTest.model')
const instance = new Razorpay({
    key_id: 'rzp_test_285YiZKcRm3PyP',
    key_secret: 'u7D7eSuwmUS5tSbLqXSMgF7z',
});

exports.checkout = async (req, res) => {
    // console.log(req.body);
    console.log(req.body.OrderDetails.CartData.cart);
    let TestDetailsFromCart = [];
    const cart = req.body.OrderDetails.CartData.cart;
    
    for (let index = 0; index < cart.length; index++) {
        const element = cart[index];
        if (element.testName) {
            TestDetailsFromCart.push(element);
        }
    }
    
    console.log(TestDetailsFromCart);
    
    try {
        const userId = req.user._id;
        console.log(userId);
        const orderData = req.body; // Assuming req.body contains the OrderData
        const testData = orderData.OrderDetails.TestInfos;
        const cartData = orderData.OrderDetails.CartData.cart;

        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };

        // Attempt to create the order with Razorpay
        let order;
        try {
            order = await instance.orders.create(options);
            console.log("Razorpay order created:", order);
        } catch (razorpayError) {
            console.error('Razorpay Error:', razorpayError);
            return res.status(502).json({
                success: false,
                message: 'Failed to create order with Razorpay',
                error: razorpayError.message,
            });
        }
        
        const newOrder = new Order({
            labName: testData.labName,
            labAddress: testData.labAddress,
            pincode: testData.pinCode,
            city: testData.city,
            fullName: testData.fullName,
            phone: testData.phone,
            optionalPhone: testData.optionalPhone,
            email: testData.email,
            date: new Date(testData.date), // Convert date string to Date object
            age: parseInt(testData.age), // Convert age string to number
            gender: testData.gender,
            appointTime: testData.appointTime,
            bookingType: testData.bookingType,
            subtotal: orderData.OrderDetails.CartData.subtotal,
            homeCollectionCharges: orderData.OrderDetails.CartData.homeCollectionCharges,
            discount: orderData.OrderDetails.CartData.discount,
            totalToPay: orderData.amount, // Assuming totalToPay comes from amount in OrderData
            cartDetails: cartData.map(item => ({
                packageName: item.packageName,
                testCategoryId: item.testCategoryId ? item.testCategoryId.map(id => new mongoose.Types.ObjectId(id)) : [],
                testQuantity: item.testQuantity,
                testGroupQuantity: item.testGroupQuantity,
                actualPrice: item.actualPrice,
                currentPrice: item.currentPrice,
                offPercentage: item.offPercentage,
                testDetails: Array.isArray(item.testDetails) ? item.testDetails.map(test => ({
                    testName: test.testName,
                })) : [],
                OrderId: order.id,
            })),
            testCartDetail: TestDetailsFromCart.map(item => ({
                test_id: new mongoose.Types.ObjectId(item._id),
                testName: item.testName,
                actualPrice: item.actualPrice,
                discountPrice: item.discountPrice,
                discountPercentage: item.discountPercentage,
            })),
                
    
            PatientId: userId,
            paymentStatus: "Pending", // Default status
            transactionId: "Cash Collections" // Default transactionId
        });

        // Save the new order to the database
        const savedOrder = await newOrder.save();

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error in checkout:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong in checkout',
            error: error.message,
        });
    }
};




exports.paymentVerification = async (req, res) => {
    try {
        console.log(req.body)
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Database logic comes here
            // await Payment.create({
            //     razorpay_order_id,
            //     razorpay_payment_id,
            //     razorpay_signature,
            // });

            res.redirect(
                `${process.env.REACT_APP_FRONTEND_URL}/booking-confirmed?reference=${razorpay_payment_id}`
            );
        } else {
            res.redirect(
                `${process.env.REACT_APP_FRONTEND_URL}/booking-failed?orderId=${razorpay_order_id}`
            );
        }
    } catch (error) {
        console.error('Error in payment verification:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong in payment verification',
        });
    }
};