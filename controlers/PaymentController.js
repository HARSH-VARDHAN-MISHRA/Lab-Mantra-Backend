const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/OrderTest.model')
const instance = new Razorpay({
    key_id: 'rzp_test_285YiZKcRm3PyP',
    key_secret: 'u7D7eSuwmUS5tSbLqXSMgF7z',
});

exports.checkout = async (req, res) => {
    try {
        const orderData = req.body; // Assuming req.body contains the OrderData
        const testData = orderData.OrderDetails.TestInfos
        const cartData = orderData.OrderDetails.CartData
       for (let index = 0; index < cartData.length; index++) {
        const element = cartData[index];
         console.log(element);
       }
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        console.log(order);
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
            subtotal: cartData.subtotal,
            homeCollectionCharges: cartData.homeCollectionCharges,
            discount: cartData.discount,
            totalToPay: orderData.amount, // Assuming totalToPay comes from amount in OrderData
            cartDetails: orderData.OrderDetails.CartData.cart.map(item => ({
                packageName: item.packageName,
                testCategoryId: item.testCategoryId,
                testQuantity: item.testQuantity,
                testGroupQuantity: item.testGroupQuantity,
                actualPrice: item.actualPrice,
                currentPrice: item.currentPrice,
                offPercentage: item.offPercentage,
                OrderId:order.id,
                testDetails: Array.isArray(item.testDetails) ? item.testDetails.map(test => ({
                    testName: test.testName,
                })) : [],
            })),
            paymentStatus: "Pending", // Default status
            transactionId: "Cash Collections" // Default transactionId
        });
// order_OW3jB8WTVnsK9F
        // Save the new order to the database
        const savedOrder = await newOrder.save();
        console.log("Save-Order", savedOrder);

        res.status(200).json({
            success: true,
            order,

        });
    } catch (error) {
        console.error('Error in checkout:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong in checkout',
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
                `http://localhost:3000/booking-confirmed?reference=${razorpay_payment_id}`
            );
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }
    } catch (error) {
        console.error('Error in payment verification:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong in payment verification',
        });
    }
};