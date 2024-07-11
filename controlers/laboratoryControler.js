// controllers/LaboratoryController.js

const Laboratory = require('../models/laboratory.model');
const haversine = require('haversine-distance');
const sendEmail = require('../utils/SendEmail');
const testModel = require('../models/test.model');

// Create new laboratory
const validateCreateLaboratory = (body) => {
    const { LabName, address, email, city, phoneNumber, state, secondPhoneNumber, pinCode, representedName } = body;

    const errors = [];

    // Validate required fields
    if (!LabName) {
        errors.push("Lab Name is required.");
    }
    if (!address) {
        errors.push("Address is required.");
    }
    if (!city) {
        errors.push("City is required.");
    }
    if (!state) {
        errors.push("State is required.");
    }
    if (!pinCode) {
        errors.push("Pin Code is required.");
    }

    return errors;
};

exports.createLaboratory = async (req, res) => {
    try {
        const { LabName,LabPassword, address, email, city, PhoneNumber, state, SecondPhoneNumber, pinCode, RepresentedName, discountPercentage } = req.body;
        // const { LabName,LabPassword, address, email, city, PhoneNumber, state, SecondPhoneNumber, pinCode, RepresentedName, discountPercentage ,tests } = req.body;
        // Validate request body
        console.log(req.body)
        const validationErrors = validateCreateLaboratory(req.body);

        if (validationErrors.length > 0) {
            return res.status(400).send({ errors: validationErrors });
        }

        // Check for duplicate lab name or email
        const existingLab = await Laboratory.findOne({ $or: [{ LabName }, { email }] });
        if (existingLab) {
            return res.status(400).json({
                success: false,
                message: "Laboratory with this name or email already exists."
            });
        }

        // Retrieve all tests from the testModel
        // const allTests = await testModel.find();
        // const testIds = [];

        // // Apply discount to each test and save
        // for (let test of allTests) {
        //     const { _id, ...testData } = test.toObject(); // Remove _id field
        //     const discountPrice = test.actualPrice - (test.actualPrice * discountPercentage / 100);
        //     const newTest = new testModel({
        //         ...testData,
        //         discountPrice,
        //         discountPercentage
        //     });

        //     const savedTest = await newTest.save();
        //     testIds.push(savedTest._id);
        // }


        // Create new laboratory instance
        const newLaboratory = new Laboratory({
            LabName,
            LabPassword,
            address,
            email,
            city,
            PhoneNumber,
            state,
            RepresentedPhoneNumber: SecondPhoneNumber,
            pinCode,
            RepresentedName,
            // tests: testIds,
            discountPercentage // Save the discount percentage for reference
        });


        // Save the new laboratory to the database
        await newLaboratory.save();
        console.log("New Lab", newLaboratory)
        // Prepare email options    
        const options = {
            email: email,
            subject: 'Please Give Your Location Access And Make Your Lab Live On Lab Mantra',
           message:`
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    background-color: #ddf3f2;
                    padding: 20px;
                    border-radius: 10px;
                    width: 600px;
                    margin: 0 auto;
                  }
                  h2 {
                    color: #003873;
                    text-align: center;
                  }
                  p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #333;
                    text-align: center;
                  }
                  strong {
                    color: #2dbcb6;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 50%;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    margin-bottom: 20px;
                    display: block;
                    margin: 0 auto;
                  }
                  .button {
                    display: inline-block;
                    padding: 15px 30px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #36BA98;
                    border: none;
                    border-radius: 5px;
                    text-decoration: none;
                    margin-top: 20px;
                    text-align: center;
                  }
                  .button:hover {
                    background-color: #2dbcb6;
                  }
                  .footer {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #333;
                    text-align: center;
                    margin-top: 20px;
                  }
                  .signature {
                    color: #F4A261;
                  }
                </style>
              </head>
              <body>
                <div>
                  <img src="https://i.ibb.co/58sw7qr/female-scientist-illustration-design.png" alt="Scientist Illustration" />
                </div>
                <h2>Hello,</h2>
                <p>
                  We are excited to invite you to make your lab live on <strong>Lab Mantra</strong>! 
                  To provide a seamless experience and connect with a wider audience, we request your location access.
                </p>
                <p>
                  Your participation will help us in providing precise and relevant information to our users, 
                  thereby enhancing their experience and trust in your services.
                </p>
                <div>
                  <a href="http://localhost:3001/give-location?LabId=${newLaboratory._id}" class="button">Give Location Access</a>
                </div>
                <p class="footer">
                  Thank you for your cooperation. Together, we can make Lab Mantra a more valuable resource for everyone.
                </p>
                <p class="footer">
                  Best Regards,<br>
                  <strong class="signature">The Lab Mantra Team</strong>
                </p>
              </body>
            </html>
          `
          
          
        };


        // Send the email (assuming sendEmail is a defined function)
        await sendEmail(options);

        // Respond with the newly created laboratory
        res.status(201).send(newLaboratory);
    } catch (error) {
        console.error("Error creating laboratory: ", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
};

exports.updateLabLocations = async (req, res) => {
    try {
        const { labId, latitude, longitude, address, pincode, city, state } = req.body;

        // Check if all required fields are provided
        if (!labId || !latitude || !longitude || !address || !pincode || !city || !state) {
            return res.status(403).json({
                success: false,
                msg: "Please Fill All Required Fields"
            });
        }

        // Find the laboratory by labId
        const lab = await Laboratory.findById(labId);

        if (!lab) {
            return res.status(404).json({
                success: false,
                msg: "Laboratory not found"
            });
        }

        // Update laboratory fields
        lab.address = address;
        lab.city = city;
        lab.state = state;
        lab.pinCode = pincode;
        lab.Longitude = longitude;
        lab.Latitude = latitude;

        // Save the updated laboratory
        await lab.save();

        return res.status(200).json({
            success: true,
            msg: "Laboratory location updated successfully",
            data: lab // Optionally, you can return the updated lab data
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
};

// Get all laboratories
exports.getLaboratories = async (req, res) => {
    try {
        const laboratories = await Laboratory.find();
        res.status(200).json({ success: true, data: laboratories });
    } catch (error) {
        console.error("Error fetching laboratories: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Find nearest laboratories and calculate distances with fees
exports.findNearestLaboratories = async (req, res) => {
    const { longitude, latitude } = req.query;

    // Validate longitude and latitude
    if (!longitude || !latitude) {
        return res.status(400).json({ success: false, message: "Longitude and latitude are required" });
    }

    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);

    // Validate numeric values for longitude and latitude
    if (isNaN(lon) || isNaN(lat)) {
        return res.status(400).json({ success: false, message: "Invalid longitude or latitude" });
    }

    // Validate range for longitude and latitude
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
        return res.status(400).json({ success: false, message: "Longitude must be between -180 and 180, and latitude must be between -90 and 90" });
    }

    try {
        // Find laboratories near the specified coordinates
        const laboratories = await Laboratory.find({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [lon, lat] },
                    $maxDistance: 10000, // 10 km
                },
            },
        });

        // Calculate distances and fees for each laboratory
        const userLocation = { latitude: lat, longitude: lon };
        const results = laboratories.map((lab) => {
            const labLocation = { latitude: lab.location.coordinates[1], longitude: lab.location.coordinates[0] };
            const distance = haversine(userLocation, labLocation) / 1000; // Distance in kilometers

            let fee = 0;
            if (distance <= 1) {
                fee = 0;
            } else if (distance <= 3) {
                fee = 60;
            } else if (distance <= 5) {
                fee = 80;
            } else {
                fee = 200;
            }

            // Return detailed information including distance and fee
            return {
                ...lab.toObject(), // Convert Mongoose document to plain object
                distance,
                fee,
            };
        });

        // Respond with the results
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error("Error finding nearest laboratories:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.getLabInformationByCityAndPinCode = async (req, res) => {
    try {
        const { pinCode, city } = req.query;
        let query = {};

        if (pinCode && city) {
            query = {
                $and: [
                    { pinCode: pinCode },
                    { city: { $regex: new RegExp(city, 'i') } }
                ]
            };
        } else if (pinCode) {
            query = { pinCode: pinCode };
        } else if (city) {
            query = { city: { $regex: new RegExp(city, 'i') } };
        } else {
            return res.status(400).json({ error: 'Either pinCode or city must be provided' });
        }

        const laboratories = await Laboratory.find(query);

        res.status(200).json(laboratories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteLaboratory = async (req,res) =>{
    try {
        const id = req.params.id;
        const checkLab = await Laboratory.deleteOne({ _id: id })
        if (!checkLab) {
            return res.status(403).json({
                success: false,
                msg: "Lab Not Found"
            })
        }
        res.status(200).json({
            success: true,
            msg: "Lab Deleted Succesfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}