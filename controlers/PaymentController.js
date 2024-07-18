
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
    const cart = req.body.OrderDetails.CartData.cart;
    const testDetailsFromCart = cart.filter(item => item.testName);

    try {
        const userId = req.user._id;
        const orderData = req.body;
        const testData = orderData.OrderDetails.TestInfos;

        // Creating order options for Razorpay
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };

        // Attempting to create an order with Razorpay
        let order;
        try {
            order = await instance.orders.create(options);
        } catch (razorpayError) {
            return res.status(502).json({
                success: false,
                message: 'Failed to create order with Razorpay',
                error: razorpayError.message,
            });
        }

        // Constructing the new order object
        const newOrder = new Order({
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
            cartDetails: cart.map(item => ({
                _id: false, // Disable auto _id for subdocuments
                packageName: item.packageName,
                testCategoryId: item.testCategoryId ? item.testCategoryId.map(id => new mongoose.Types.ObjectId(id)) : [],
                testQuantity: item.testQuantity,
                testGroupQuantity: item.testGroupQuantity,
                actualPrice: item.actualPrice,
                currentPrice: item.currentPrice,
                offPercentage: item.offPercentage,
                testDetails: Array.isArray(item.testDetails) ? item.testDetails.map(test => ({
                    testName: test.testName,
                    // Add more fields from testDetails array if needed
                })) : [],
                labBranchId: item.labBranchId ? new mongoose.Types.ObjectId(item.labBranchId) : null,
                branchName: item.branchName,
                branchEMail: item.branchEMail,
                branchLocation: item.branchLocation,
                HowManyDiscountAppliedForThisLab: item.HowManyDiscountAppliedForThisLab,
                testPrice: item.testPrice,
                discountedPrice: item.discountedPrice,
                discountPercentage: item.discountPercentage,
            })),
            testCartDetail: testDetailsFromCart.map(item => ({
                _id: false, // Disable auto _id for subdocuments
                test_id: new mongoose.Types.ObjectId(item.test_id),
                testName: item.testName,
                actualPrice: item.actualPrice,
                discountPrice: item.discountPrice,
                discountPercentage: item.discountPercentage,
                labBranchId: item.labBranchId ? new mongoose.Types.ObjectId(item.labBranchId) : null,
                branchName: item.branchName,
                branchEMail: item.branchEMail,
                branchLocation: item.branchLocation,
                HowManyDiscountAppliedForThisLab: item.HowManyDiscountAppliedForThisLab,
                testPrice: item.testPrice,
                discountedPrice: item.discountedPrice,
            })),

            OrderId:order.id,
            paymentStatus:order.status,
            PatientId: userId,
            // Default status
        });

        // Save the new order to the database
        const savedOrder = await newOrder.save();

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong in checkout',
            error: error.message,
        });
    }
};

exports.MakeCashOnDeliveryCheckOut = async (req, res) => {
    const cart = req.body.OrderDetails.CartData.cart;
    const testDetailsFromCart = cart.filter(item => item.testName);

    try {
        const userId = req.user._id;
        const orderData = req.body;
        const testData = orderData.OrderDetails.TestInfos;
        console.log(cart);





        // Constructing the new order object
        const newOrder = new Order({
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
            cartDetails: cart.map(item => ({
                _id: false, // Disable auto _id for subdocuments
                packageName: item.packageName,
                testCategoryId: item.testCategoryId ? item.testCategoryId.map(id => new mongoose.Types.ObjectId(id)) : [],
                testQuantity: item.testQuantity,
                testGroupQuantity: item.testGroupQuantity,
                actualPrice: item.actualPrice,
                currentPrice: item.currentPrice,
                offPercentage: item.offPercentage,
                testDetails: Array.isArray(item.testDetails) ? item.testDetails.map(test => ({
                    testName: test.testName,
                    // Add more fields from testDetails array if needed
                })) : [],
                labBranchId: item.labBranchId ? new mongoose.Types.ObjectId(item.labBranchId) : null,
                branchName: item.branchName,
                branchEMail: item.branchEMail,
                branchLocation: item.branchLocation,
                HowManyDiscountAppliedForThisLab: item.HowManyDiscountAppliedForThisLab,
                testPrice: item.testPrice,
                discountedPrice: item.discountedPrice,
                discountPercentage: item.discountPercentage,
            })),
            testCartDetail: testDetailsFromCart.map(item => ({
                _id: false, // Disable auto _id for subdocuments
                test_id: new mongoose.Types.ObjectId(item.test_id),
                testName: item.testName,
                actualPrice: item.actualPrice,
                discountPrice: item.discountPrice,
                discountPercentage: item.discountPercentage,
                labBranchId: item.labBranchId ? new mongoose.Types.ObjectId(item.labBranchId) : null,
                branchName: item.branchName,
                branchEMail: item.branchEMail,
                branchLocation: item.branchLocation,
                HowManyDiscountAppliedForThisLab: item.HowManyDiscountAppliedForThisLab,
                testPrice: item.testPrice,
                discountedPrice: item.discountedPrice,
            })),


            PatientId: userId,
            paymentStatus: "COD" // Default status
        });
        const savedOrder = await newOrder.save();




        const userMailOptions = {
            email: newOrder.email,
            subject: "Successful Home Collection Sample and Booking Confirmation",
            message: `
              <html>
              <head>
                  <style>
                      body { 
                          font-family: Arial, sans-serif; 
                          background-color: #f0fffe; 
                          padding: 20px; 
                          margin: 0;
                      }
                      .container { 
                          max-width: 600px; 
                          margin: 0 auto; 
                          background-color: #ffffff; 
                          border: 1px solid #b5e7e6; 
                          border-radius: 5px; 
                          padding: 20px; 
                          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      }
                      h2 { 
                          color: #00AAA9; 
                          text-align: center; 
                          margin-bottom: 20px;
                      }
                      .booking-details { 
                          background-color: #ddf3f2; 
                          padding: 15px; 
                          border-radius: 5px; 
                          margin-bottom: 20px;
                      }
                      h3 { 
                          color: #003873; 
                          margin-bottom: 10px; 
                      }
                      ul { 
                          list-style-type: none; 
                          padding: 0; 
                          margin: 0;
                      }
                      ul li { 
                          margin-bottom: 10px; 
                          color: #000000;
                      }
                      p { 
                          color: #000000; 
                          margin-bottom: 20px;
                      }
                      hr {
                          border: none;
                          border-top: 1px solid #b5e7e6;
                          margin: 20px 0;
                      }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <h2>Successful Home Collection and Booking Confirmation</h2>
                      <p>Dear ${newOrder.fullName},</p>
                      <p>We are delighted to inform you that your payment for the booking has been successfully processed.</p>
                      <div class="booking-details">
                          <h3>Booking Details:</h3>
                          <ul>
                              <li><strong>Amount Unpaid:</strong> ₹${savedOrder.totalToPay}</li>
                              <li><strong>Payment Status:</strong> ${savedOrder.paymentStatus}</li>
                              <li><strong>Appointment Time:</strong> ${savedOrder.appointTime}</li>
                          </ul>
                          <hr/>
                          <h3>User Info:</h3>
                          <ul>
                              <li><strong>Full Name:</strong> ${newOrder.fullName}</li>
                              <li><strong>City:</strong> ${newOrder.city}</li>
                              <li><strong>Phone Number:</strong> ${newOrder.phone}</li>
                              <li><strong>Email:</strong> ${newOrder.email}</li>
                              <li><strong>Gender:</strong> ${newOrder.gender}</li>
                          </ul>
                      </div>
                      <p>Thank you for choosing our services. We look forward to serving you.</p>
                      <p>Best regards,<br>Your Company Name</p>
                  </div>
              </body>
              </html>
            `
        };

        const testDetailsHtml = savedOrder.cartDetails.map(item => `
            <ul>
                <li><strong>Package Name:</strong> ${item.packageName || 'N/A'}</li>
                <li><strong>Test Quantity:</strong> ${item.testQuantity || 'N/A'}</li>
                <li><strong>Test Group Quantity:</strong> ${item.testGroupQuantity || 'N/A'}</li>
                <li><strong>Actual Price:</strong> ₹${item.actualPrice || 'N/A'}</li>
                <li><strong>Current Price:</strong> ₹${item.currentPrice || 'N/A'}</li>
                <li><strong>Off Percentage:</strong> ${item.offPercentage || 'N/A'}%</li>
                <li><strong>Branch Name:</strong> ${item.branchName || 'N/A'}</li>
                <li><strong>Branch Email:</strong> ${item.branchEMail || 'N/A'}</li>
                <li><strong>Branch Location:</strong> ${item.branchLocation || 'N/A'}</li>
                <li><strong>How Many Discount Applied For This Lab:</strong> ${item.HowManyDiscountAppliedForThisLab || 'N/A'}</li>
                <li><strong>Test Price:</strong> ₹${item.testPrice || 'N/A'}</li>
                <li><strong>Discounted Price:</strong> ₹${item.discountedPrice || 'N/A'}</li>
                <li><strong>Discount Percentage:</strong> ${item.discountPercentage || 'N/A'}%</li>
                <li><strong>Test Details:</strong>
                    <ul>
                        ${item.testDetails.map(test => `<li>${test.testName || 'N/A'}</li>`).join('')}
                    </ul>
                </li>
            </ul>
        `).join('');

        const testCartHtml = savedOrder.testCartDetail.map(item => `
            <ul>
                <li><strong>Test Name:</strong> ${item.testName || 'N/A'}</li>
                <li><strong>Actual Price:</strong> ₹${item.actualPrice || 'N/A'}</li>
                <li><strong>Discount Price:</strong> ₹${item.discountPrice || 'N/A'}</li>
                <li><strong>Discount Percentage:</strong> ${item.discountPercentage || 'N/A'}%</li>
                <li><strong>Branch Name:</strong> ${item.branchName || 'N/A'}</li>
                <li><strong>Branch Email:</strong> ${item.branchEMail || 'N/A'}</li>
                <li><strong>Branch Location:</strong> ${item.branchLocation || 'N/A'}</li>
                <li><strong>How Many Discount Applied For This Lab:</strong> ${item.HowManyDiscountAppliedForThisLab || 'N/A'}</li>
                <li><strong>Test Price:</strong> ₹${item.testPrice || 'N/A'}</li>
                <li><strong>Discounted Price:</strong> ₹${item.discountedPrice || 'N/A'}</li>
            </ul>
        `).join('');

        const labMailOptions = {

            email: newOrder.testCartDetail[0].branchEMail,
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
                            p { color: #000000; },
                             body { 
                          font-family: Arial, sans-serif; 
                          background-color: #f0fffe; 
                          padding: 20px; 
                          margin: 0;
                      }
                      .container { 
                          max-width: 600px; 
                          margin: 0 auto; 
                          background-color: #ffffff; 
                          border: 1px solid #b5e7e6; 
                          border-radius: 5px; 
                          padding: 20px; 
                          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      }
                      h2 { 
                          color: #00AAA9; 
                          text-align: center; 
                          margin-bottom: 20px;
                      }
                      .booking-details { 
                          background-color: #ddf3f2; 
                          padding: 15px; 
                          border-radius: 5px; 
                          margin-bottom: 20px;
                      }
                      h3 { 
                          color: #003873; 
                          margin-bottom: 10px; 
                      }
                      ul { 
                          list-style-type: none; 
                          padding: 0; 
                          margin: 0;
                      }
                      ul li { 
                          margin-bottom: 10px; 
                          color: #000000;
                      }
                      p { 
                          color: #000000; 
                          margin-bottom: 20px;
                      }
                      hr {
                          border: none;
                          border-top: 1px solid #b5e7e6;
                          margin: 20px 0;
                      }
                        </style>
                    </head>
                    <body>
                    <div class="container">
                    <h2>New Test  Booking Confirmation</h2>
                    <p>Dear ${newOrder.fullName},</p>
                    <p>We are delighted to inform you that your payment for the booking has been successfully processed.</p>
                    <div class="booking-details">
                        <h3>Booking Details:</h3>
                        <ul>
                            <li><strong>Amount Paid:</strong> ₹${savedOrder.totalToPay}</li>
                            <li><strong>Payment Status:</strong> ${savedOrder.paymentStatus}</li>
                            <li><strong>Appointment Time:</strong> ${savedOrder.appointTime}</li>
                        </ul>
                        <h3>User Info:</h3>
                          <ul>
                              <li><strong>Full Name:</strong> ${newOrder.fullName}</li>
                              <li><strong>City:</strong> ${newOrder.city}</li>
                              <li><strong>Phone Number:</strong> ${newOrder.phone}</li>
                              <li><strong>Email:</strong> ${newOrder.email}</li>
                              <li><strong>Gender:</strong> ${newOrder.gender}</li>
                          </ul>
                        ${testDetailsHtml}
                        ${testCartHtml}
                    </div>
                    <p>Thank you for choosing our services. We look forward to serving you.</p>
                    <p>Best regards,<br>Your Company Name</p>
                </div>
                    </body>
                    </html>

                    `
        };

        // Send emails
        await sendEmail(userMailOptions);
        await sendEmail(labMailOptions);

        // Save the new order to the database


        res.status(200).json({
            success: true,
            savedOrder,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong in checkout',
            error: error,
        });
    }
}



exports.paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log(req.body);
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
            //             const userMailOptions = {

            //                 email: latestOrder.email,
            //                 subject: "Successful Payment and Booking Confirmation",
            //                 message: `
            //                     <html>
            //                     <head>
            //                         <style>
            //                             body { font-family: Arial, sans-serif; background-color: #f0fffe; padding: 20px; }
            //                             .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #b5e7e6; border-radius: 5px; padding: 20px; }
            //                             h2 { color: #00aaa9; }
            //                             .booking-details { background-color: #ddf3f2; padding: 10px; border-radius: 5px; }
            //                             h3 { color: #003873; }
            //                             ul { list-style-type: none; padding: 0; }
            //                             p { color: #000000; }
            //                         </style>
            //                     </head>
            //                     <body>
            //                         <div class="container">
            //                             <h2>Successful Payment and Booking Confirmation</h2>
            //                             <p>Dear ${latestOrder.fullName},</p>
            //                             <p>We are delighted to inform you that your payment for the booking has been successfully processed.</p>
            //                             <div class="booking-details">
            //                                 <h3>Booking Details:</h3>
            //                                 <ul>
            //                                     <li><strong>Transaction ID:</strong> ${latestOrder.transactionId}</li>
            //                                     <li><strong>Amount Paid:</strong> ₹${latestOrder.totalToPay}</li>
            //                                     <li><strong>Payment Status:</strong> ${latestOrder.paymentStatus}</li>
            //                                     <li><strong>Appointment Time:</strong> ${latestOrder.appointTime}</li>
            //                                     <li><strong>Lab Name:</strong> ${latestOrder.labName}</li>
            //                                     <li><strong>Address:</strong> ${latestOrder.labAddress}</li>
            //                                 </ul>
            //                             </div>
            //                             <p>Thank you for choosing our services. We look forward to serving you.</p>
            //                             <p>Best regards,<br>Your Company Name</p>
            //                         </div>
            //                     </body>
            //                     </html>
            //                 `
            //             };
            //             const labMailOptions = {

            //                 email: latestOrder.labEmail,
            //                 subject: "New Booking Received",
            //                 message: `
            //                 <html>
            //                 <head>
            //                     <style>
            //                         body { font-family: Arial, sans-serif; background-color: #ddf3f2; padding: 20px; }
            //                         .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #b5e7e6; border-radius: 5px; padding: 20px; }
            //                         h2 { color: #00aaa9; }
            //                         .booking-details { background-color: #ddf3f2; padding: 10px; border-radius: 5px; }
            //                         h3 { color: #003873; }
            //                         ul { list-style-type: none; padding: 0; }
            //                         p { color: #000000; }
            //                     </style>
            //                 </head>
            //                 <body>
            //                     <div class="container">
            //                         <h2>New Booking Received</h2>
            //                         <p>Dear ${latestOrder.labName},</p>
            //                         <p>We are pleased to inform you that a new booking has been received.</p>
            //                         <div class="booking-details">
            //                             <h3>Booking Details:</h3>
            //                             <ul>
            //     <li><strong>Patient Name:</strong> ${latestOrder.fullName}</li>
            //     <li><strong>Phone:</strong> ${latestOrder.phone}</li>
            //     <li><strong>Email:</strong> ${latestOrder.email}</li>
            //     <li><strong>Age:</strong> ${latestOrder.age}</li>
            //     <li><strong>Gender:</strong> ${latestOrder.gender}</li>
            //     ${latestOrder.bookingType === 'homeCollection' ? `
            //         <li><strong>Address:</strong> ${latestOrder.address}</li>
            //     ` : ''}
            //     <li><strong>Appointment Time:</strong> ${latestOrder.appointTime}</li>
            //     <li><strong>Booking Type:</strong> ${latestOrder.bookingType}</li>
            // </ul>

            //                             <h3>Tests and Packages:</h3>
            //                             <ul>
            //                                 ${latestOrder.cartDetails.map(item => `
            //                                     <li>
            //                                         <strong>Package Name:</strong> ${item.packageName}<br>
            //                                         <strong>Tests:</strong> ${item.testCategoryId.join(', ')}<br>
            //                                         <strong>Quantity:</strong> ${item.testQuantity}<br>
            //                                         <strong>Group Quantity:</strong> ${item.testGroupQuantity}<br>
            //                                         <strong>Current Price:</strong> ₹${item.currentPrice}<br>
            //                                     </li>
            //                                 `).join('')}
            //                             </ul>
            //                         </div>
            //                         <p>Thank you for using our services. We look forward to serving the patient.</p>
            //                         <p>Best regards,<br>Your Company Name</p>
            //                     </div>
            //                 </body>
            //                 </html>

            //                 `
            //             };

            //             // Send emails
            //             await sendEmail(userMailOptions);
            //             await sendEmail(labMailOptions);


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