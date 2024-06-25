const testCategoryModel = require("../models/testCategory.model");

// Create Test Category
exports.createTestCategory = async (req, res) => {
    try {
        console.log(req.body);
        const { testCategoryName, testId, testNumber } = req.body;

        if (!testCategoryName || !testId || testId.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields."
            });
        }

        const existingTestCategory = await testCategoryModel.findOne({ testCategoryName });
        if (existingTestCategory) {
            return res.status(400).json({
                success: false,
                message: "Test Category already exists."
            });
        }

        const newTestCategory = new testCategoryModel({
            testCategoryName,
            testId,
            testNumber
        });

        await newTestCategory.save();
        res.status(201).json({
            success: true,
            data: newTestCategory,
            message: "Test Category created successfully."
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get All Test Categories
exports.getAllTestCategory = async (req, res) => {
    try {
        const getAllTestCate = await testCategoryModel.find().populate('testId');
        if (getAllTestCate.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Test Category not found."
            });
        }
        res.status(200).json({
            success: true,
            data: getAllTestCate,
            message: "All Test Categories found."
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Delete Test Category
exports.deleteTestCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const checkTestCate = await testCategoryModel.findByIdAndDelete(id);
        if (!checkTestCate) {
            return res.status(404).json({
                success: false,
                message: "Test Category not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "Test Category deleted successfully."
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Update Test Category
exports.updateTestCategory = async (req, res) => {
    try {
        const testCategoryId = req.params.id;
        const updates = req.body;

        // Check if there are no fields to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update."
            });
        }

        const options = { new: true, runValidators: true }; // Return the modified document and run validators
        const updatedTestCategory = await testCategoryModel.findByIdAndUpdate(testCategoryId, updates, options);
        if (!updatedTestCategory) {
            return res.status(404).json({
                success: false,
                message: "Test Category not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Test Category updated successfully.",
            data: updatedTestCategory
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
