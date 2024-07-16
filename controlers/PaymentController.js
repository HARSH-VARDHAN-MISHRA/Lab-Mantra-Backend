
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/OrderTest.model');
const sendEmail = require('../utils/SendEmail');
const instance = new Razorpay({
    key_id: 'rzp_test_gU4w4jM7ASo0XA',
    key_secret: 'khlbmv5fXQVkCt5JSBGM5gvb',
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
            // console.log("Razorpay order created:", order);
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
            labEmail: testData.labEmail,
            labId: testData.labId,
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
                })) : []
            })),
            testCartDetail: TestDetailsFromCart.map(item => ({
                test_id: new mongoose.Types.ObjectId(item._id),
                testName: item.testName,
                actualPrice: item.actualPrice,
                discountPrice: item.discountPrice,
                discountPercentage: item.discountPercentage,
            })),

            OrderId: order.id,
            PatientId: userId,
            paymentStatus: order.status// Default status

        });
        // console.log(newOrder)
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


exports.MakeCashOnDeliveryCheckOut = async (req, res) => {
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


    try {
        const userId = req.user._id;
        console.log(userId);
        const orderData = req.body; // Assuming req.body contains the OrderData
        const testData = orderData.OrderDetails.TestInfos;
        const cartData = orderData.OrderDetails.CartData.cart;

        const newOrder = new Order({
            labName: testData.labName,
            labAddress: testData.labAddress,
            labEmail: testData.labEmail,
            labId: testData.labId,
            pincode: testData.pinCode,
            city: testData.city,
            fullName: testData.fullName,
            phone: testData.phone,
            optionalPhone: testData.optionalPhone,
            address: testData.address,
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
                })) : []
            })),
            testCartDetail: TestDetailsFromCart.map(item => ({
                test_id: new mongoose.Types.ObjectId(item._id),
                testName: item.testName,
                actualPrice: item.actualPrice,
                discountPrice: item.discountPrice,
                discountPercentage: item.discountPercentage,
            })),

            PaymentMethod: "COD",
            PatientId: userId,
            paymentStatus: "Pending"// Default status

        });
        // console.log(newOrder)
        // Save the new order to the database
        const savedOrder = await newOrder.save();

        res.status(200).json({
            success: true,
            savedOrder,
        });
    } catch (error) {
        console.error('Error in checkout:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong in checkout',
            error: error.message,
        });
    }
}



exports.paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
            .update(body)
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Find the latest order by orderId
            const latestOrder = await Order.findOneAndUpdate(
                { OrderId: razorpay_order_id },
                {
                    $set: {
                        transactionId: razorpay_payment_id,
                        PaymentDone: true,
                        paymentStatus: "Success"
                    }
                },
                { new: true } // To return the updated document
            );

            if (!latestOrder) {
                return res.status(403).json({
                    success: false,
                    msg: "No Order Found"
                });
            }
            const userMailOptions = {

                email: latestOrder.email,
                subject: "Successful Payment and Booking Confirmation",
                message: `
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; background-color: #f0fffe; padding: 20px; }
                            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #b5e7e6; border-radius: 5px; padding: 20px; }
                            h2 { color: #00aaa9; }
                            .booking-details { background-color: #ddf3f2; padding: 10px; border-radius: 5px; }
                            h3 { color: #003873; }
                            ul { list-style-type: none; padding: 0; }
                            p { color: #000000; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Successful Payment and Booking Confirmation</h2>
                            <p>Dear ${latestOrder.fullName},</p>
                            <p>We are delighted to inform you that your payment for the booking has been successfully processed.</p>
                            <div class="booking-details">
                                <h3>Booking Details:</h3>
                                <ul>
                                    <li><strong>Transaction ID:</strong> ${latestOrder.transactionId}</li>
                                    <li><strong>Amount Paid:</strong> ₹${latestOrder.totalToPay}</li>
                                    <li><strong>Payment Status:</strong> ${latestOrder.paymentStatus}</li>
                                    <li><strong>Appointment Time:</strong> ${latestOrder.appointTime}</li>
                                    <li><strong>Lab Name:</strong> ${latestOrder.labName}</li>
                                    <li><strong>Address:</strong> ${latestOrder.labAddress}</li>
                                </ul>
                            </div>
                            <p>Thank you for choosing our services. We look forward to serving you.</p>
                            <p>Best regards,<br>Your Company Name</p>
                        </div>
                    </body>
                    </html>
                `
            };
            const labMailOptions = {

                email: latestOrder.labEmail,
                subject: "New Booking Received",
                message: `
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #ddf3f2; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #b5e7e6; border-radius: 5px; padding: 20px; }
                        h2 { color: #00aaa9; }
                        .booking-details { background-color: #ddf3f2; padding: 10px; border-radius: 5px; }
                        h3 { color: #003873; }
                        ul { list-style-type: none; padding: 0; }
                        p { color: #000000; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>New Booking Received</h2>
                        <p>Dear ${latestOrder.labName},</p>
                        <p>We are pleased to inform you that a new booking has been received.</p>
                        <div class="booking-details">
                            <h3>Booking Details:</h3>
                            <ul>
    <li><strong>Patient Name:</strong> ${latestOrder.fullName}</li>
    <li><strong>Phone:</strong> ${latestOrder.phone}</li>
    <li><strong>Email:</strong> ${latestOrder.email}</li>
    <li><strong>Age:</strong> ${latestOrder.age}</li>
    <li><strong>Gender:</strong> ${latestOrder.gender}</li>
    ${latestOrder.bookingType === 'homeCollection' ? `
        <li><strong>Address:</strong> ${latestOrder.address}</li>
    ` : ''}
    <li><strong>Appointment Time:</strong> ${latestOrder.appointTime}</li>
    <li><strong>Booking Type:</strong> ${latestOrder.bookingType}</li>
</ul>

                            <h3>Tests and Packages:</h3>
                            <ul>
                                ${latestOrder.cartDetails.map(item => `
                                    <li>
                                        <strong>Package Name:</strong> ${item.packageName}<br>
                                        <strong>Tests:</strong> ${item.testCategoryId.join(', ')}<br>
                                        <strong>Quantity:</strong> ${item.testQuantity}<br>
                                        <strong>Group Quantity:</strong> ${item.testGroupQuantity}<br>
                                        <strong>Current Price:</strong> ₹${item.currentPrice}<br>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <p>Thank you for using our services. We look forward to serving the patient.</p>
                        <p>Best regards,<br>Your Company Name</p>
                    </div>
                </body>
                </html>
            
                `
            };

            // Send emails
            await sendEmail(userMailOptions);
            await sendEmail(labMailOptions);


            // Database logic can come here for additional operations

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