const testCategoryModel = require("../models/testCategory.model");


// create Test Category
exports.createTestCategory = async (req,res) =>{
    try {
        console.log(req.body);
        const { testCategoryName,testName,testNumber} = req.body;

        if(!testCategoryName || !testName){
            return res.status(403).json({
                success: false,
                message: "Please Provide All Fields !!"
            })
        }

        const existingTestcategory = await testCategoryModel.findOne({testCategoryName : testCategoryName});
        if (existingTestcategory) {
            return res.status(403).json({
                success: false,
                message: "Test Category Already Exists !!"
            });
        }
        const newTestCategory = new testCategoryModel({
            testCategoryName,
            testName,
            testNumber
        })
        await newTestCategory.save();
        res.status(200).json({
            success: true,
            data: newTestCategory,
            message: "Test Category Created Successfully !!"
        })

    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Get All Test Category
exports.getAllTestCategory = async (req,res) =>{
    try {
        const getAllTestCate = await testCategoryModel.find();
        if (getAllTestCate.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Test Category Not Found"
            })
        }
        res.status(200).json({
            success: true,
            data: getAllTestCate,
            message: "All Test Category Found"
        })

    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Delete Test Category
exports.deleteTestCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const checkTestCate = await testCategoryModel.deleteOne({ _id: id })
        if (!checkTestCate) {
            return res.status(403).json({
                success: false,
                message: "Test Category Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Test Category Deleted Succesfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Update Test Category
exports.updateTestCategory = async (req, res) => {
    try {
        const testCategoryNameId = req.params.id;
        const updates = req.body;

        // Check if there are no fields to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update."
            });
        }

        const options = { new: true }; // Return the modified document
        const updatedtestCategoryName = await testCategoryModel.findByIdAndUpdate(testCategoryNameId, updates, options);
        if (!updatedtestCategoryName) {
            return res.status(404).json({
                success: false,
                message: "Test Category not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Test Category updated successfully.",
            data: updatedtestCategoryName
        });
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}