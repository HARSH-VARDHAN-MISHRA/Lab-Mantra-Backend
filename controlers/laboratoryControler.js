// controllers/LaboratoryController.js

const Laboratory = require('../models/laboratory.model');
const haversine = require('haversine-distance');
const sendEmail = require('../utils/SendEmail');

// Create new laboratory
const validateCreateLaboratory = (body) => {
    const { name, address, email, city, phoneNumber, state, secondPhoneNumber, pinCode, representedName } = body;

    const errors = [];

    // Validate required fields
    if (!name) {
        errors.push("Name is required.");
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
        const { name, address, email, city, PhoneNumber, state, SecondPhoneNumber, pinCode, RepresentedName,latitude,longitude } = req.body;
        // Validate request body
        console.log(req.body)
        const validationErrors = validateCreateLaboratory(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).send({ errors: validationErrors });
        }

        // Check for duplicate lab name or email
        const existingLab = await Laboratory.findOne({ $or: [{ name }, { email }] });
        if (existingLab) {
            return res.status(400).json({
                success: false,
                message: "Laboratory with this name or email already exists."
            });
        }

        // Create new laboratory instance
        const newLaboratory = new Laboratory({
            LabName:name,
            address,
            email,
            city,
            PhoneNumber,
            state,
            RepresentedPhoneNumber:SecondPhoneNumber,
            pinCode,
            RepresentedName,
            Longitude:longitude,
            Latitude:latitude
        });

        // Save the new laboratory to the database
        await newLaboratory.save(); 
        console.log("New Lab", newLaboratory)
        // Prepare email options    
        const options = {
            email: email,
            subject: 'Please Give Your Location Access And Make Your Lab Live On Lab Mantra',
            message: `
                <div style="font-family: Arial, sans-serif; color: #333; background-color: #E9C46A; padding: 20px; border-radius: 10px; width: 600px; margin: 0 auto;">
                    <h2 style="color: #E76F51; text-align: center;">Hello,</h2>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">
                        We are excited to invite you to make your lab live on <strong style="color: #36BA98;">Lab Mantra</strong>! 
                        To provide a seamless experience and connect with a wider audience, we request your location access.
                    </p>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">
                        Your participation will help us in providing precise and relevant information to our users, 
                        thereby enhancing their experience and trust in your services.
                    </p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="http://localhost:3001/give-location?LabId=${newLaboratory._id}" style="
                            display: inline-block;
                            padding: 15px 30px;
                            font-size: 16px;
                            color: #fff;
                            background-color: #36BA98;
                            border: none;
                            border-radius: 5px;
                            text-decoration: none;
                        ">Give Location Access</a>
                    </div>
                    <p style="font-size: 16px; line-height: 1.5; margin-top: 20px; color: #333;">
                        Thank you for your cooperation. Together, we can make Lab Mantra a more valuable resource for everyone.
                    </p>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">
                        Best Regards,<br>
                        <strong style="color: #F4A261;">The Lab Mantra Team</strong>
                    </p>
                </div>
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
