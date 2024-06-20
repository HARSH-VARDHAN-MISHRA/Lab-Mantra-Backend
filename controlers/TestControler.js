const testModel = require("../models/test.model");


// create test
exports.createTest = async (req,res) =>{
    try {
        console.log(req.body);
        const { testName,actualPrice,discountPrice,discountPercentage} = req.body;

        if(!testName || !actualPrice){
            return res.status(403).json({
                success: false,
                message: "Please Provide All Fields !!"
            })
        }

        const existingTest = await testModel.findOne({testName : testName});
        if (existingTest) {
            return res.status(403).json({
                success: false,
                message: "Test Name Already Exists !!"
            });
        }
        const newTest = new testModel({
            testName,
            actualPrice,
            discountPrice,
            discountPercentage
        })
        await newTest.save();
        res.status(200).json({
            success: true,
            data: newTest,
            message: "Test Created Successfully !!"
        })

    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Get All Tests
exports.getAllTest = async (req,res) =>{
    try {
        const getAllTest = await testModel.find();
        if (getAllTest.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Test Not Found"
            })
        }
        res.status(200).json({
            success: true,
            data: getAllTest,
            message: "All Test Found"
        })

    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Delete Test
exports.deleteTest = async (req, res) => {
    try {
        const id = req.params.id;
        const checkTest = await testModel.deleteOne({ _id: id })
        if (!checkTest) {
            return res.status(403).json({
                success: false,
                message: "Test Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Test Deleted Succesfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Update Test
exports.updateTest = async (req, res) => {
    try {
        const testId = req.params.id;
        const updates = req.body;

        // Check if there are no fields to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update."
            });
        }

        const options = { new: true }; // Return the modified document
        const updatedTest = await testModel.findByIdAndUpdate(testId, updates, options);
        if (!updatedTest) {
            return res.status(404).json({
                success: false,
                message: "Test not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Test updated successfully.",
            data: updatedTest
        });
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}