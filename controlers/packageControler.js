// Import necessary modules
const mongoose = require('mongoose');
const packageModel = require('../models/package.model');

// Function to create a new package
exports.createPackage = async (req, res) => {
    try {
        console.log(req.body)
        const { packageName, testQuantity, testGroupQuantity, currentPrice, actualPrice, testCategoryId, offPercentage } = req.body;

        // Check required fields
        if (!packageName || !testCategoryId || !actualPrice) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: Package Name, Test Categories, Actual Price."
            });
        }

        // Check if package already exists
        const existingPackage = await packageModel.findOne({ packageName });
        if (existingPackage) {
            return res.status(400).json({
                success: false,
                message: "Package already exists."
            });
        }

        // Create new package instance
        const newPackage = new packageModel({
            packageName,
            testQuantity,
            testGroupQuantity,
            currentPrice,
            actualPrice,
            testCategoryId,
            offPercentage
        });

        // Save the new package to the database
        await newPackage.save();

        res.status(201).json({
            success: true,
            data: newPackage,
            message: "Package created successfully."
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Function to get all packages
exports.getAllPackage = async (req, res) => {
    try {
        const getAllPackage = await packageModel.find().populate('testCategoryId');

        if (getAllPackage.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No packages found."
            });
        }

        res.status(200).json({
            success: true,
            data: getAllPackage,
            message: "All packages found."
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Function to delete a package by ID
exports.deletePackage = async (req, res) => {
    try {
        const packageId = req.params.id;

        const deletedPackage = await packageModel.findByIdAndDelete(packageId);

        if (!deletedPackage) {
            return res.status(404).json({
                success: false,
                message: "Package not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Package deleted successfully."
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Function to update a package by ID
exports.updatePackage = async (req, res) => {
    try {
        const packageId = req.params.id;
        const updates = req.body;

        // Check if there are no fields to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update."
            });
        }

        const options = { new: true }; // Return the modified document
        const updatedPackage = await packageModel.findByIdAndUpdate(packageId, updates, options);

        if (!updatedPackage) {
            return res.status(404).json({
                success: false,
                message: "Package not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Package updated successfully.",
            data: updatedPackage
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
