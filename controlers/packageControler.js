// Import necessary modules
const mongoose = require('mongoose');
const packageModel = require('../models/package.model');
const testCategoryModel = require("../models/testCategory.model");

const { ObjectId } = require('mongoose').Types;
// Function to create a new package
exports.createPackage = async (req, res) => {
    try {
        console.log(req.body)
        const { packageName, testQuantity, testGroupQuantity, currentPrice, actualPrice, testCategoryIds, offPercentage } = req.body;

        // Check required fields
        if (!packageName || !testCategoryIds || !actualPrice) {
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
            testCategoryId: testCategoryIds,
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

        const transformedPackages = await Promise.all(getAllPackage.map(async (pkg) => {
            try {
                const testCategoryIds = pkg.testCategoryId.map(category => category._id.toString()); // Convert test category IDs to strings

                const matchedTestCategories = await testCategoryModel.find({ _id: { $in: testCategoryIds } }).populate('testId');
                console.log("Test Category IDs:", testCategoryIds);
                console.log("Matched Test Categories:", matchedTestCategories);

                // Flatten the test details from matched test categories
                const matchedTestDetails = matchedTestCategories.flatMap(category => category.testId);

                return {
                    ...pkg.toObject(),
                    testCategoryId: pkg.testCategoryId.map(category => category._id),
                    testDetails: matchedTestDetails // Assign matched test details
                };
            } catch (error) {
                console.error("Error:", error);
                throw new Error("Error fetching test details");
            }
        }));

        res.status(200).json({
            success: true,
            data: transformedPackages,
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
