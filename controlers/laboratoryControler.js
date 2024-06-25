// controllers/LaboratoryController.js

const Laboratory = require('../models/laboratory.model');
const haversine = require('haversine-distance');

// Create new laboratory
exports.createLaboratory = async (req, res) => {
    try {
        const { name, address, city, state, pinCode, tests, location } = req.body;

        // Validate required fields
        if (!name || !address || !city || !state || !pinCode || !tests || !location || !location.coordinates || location.coordinates.length !== 2) {
            return res.status(400).send({ error: "All fields are required: name, address, city, state, pinCode, tests, and location (with coordinates)." });
        }

        // Check for duplicate lab name
        const existingLab = await Laboratory.findOne({ name });
        if (existingLab) {
            return res.status(400).json({
                success: false,
                message: "Laboratory with this name already exists."
            });
        }

        // Ensure location type is 'Point'
        location.type = 'Point';

        const laboratory = new Laboratory({ name, address, city, state, pinCode, tests, location });
        await laboratory.save();

        res.status(201).send(laboratory);
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
