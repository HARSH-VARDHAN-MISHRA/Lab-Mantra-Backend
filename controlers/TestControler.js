const testModel = require("../models/test.model");
const Branch = require('../models/laboratoryBrach.model')
const Labs = require('../models/laboratory.model')
// create test
exports.createTest = async (req, res) => {
    try {
        console.log(req.body);
        const { testName, actualPrice, discountPrice, discountPercentage } = req.body;

        if (!testName || !actualPrice) {
            return res.status(403).json({
                success: false,
                message: "Please Provide All Fields !!"
            })
        }

        const existingTest = await testModel.findOne({ testName: testName });
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
exports.getAllTest = async (req, res) => {
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


exports.AddBranchIdAndDiscount = async (req, res) => {
    try {

        const { BranchId, HowManyDiscountAppliedForThisLab } = req.body;
        console.log(req.body);
        if (!BranchId) {
            return res.status(403).json({
                success: false,
                msg: "No Branch id is Given"
            });
        }

        // Check branch details
        const isBranchAvailable = await Branch.findById(BranchId);
        if (!isBranchAvailable) {
            return res.status(403).json({
                success: false,
                msg: "No Branch Found With Given id "
            });
        }


        // Update all test details with the specified branch and discount
        const updatedtest = await testModel.updateMany(
            {},
            {
                $push: {
                    Branch: {
                        labBranchId: BranchId,
                        HowManyDiscountAppliedForThisLab
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            updatedtest,
            msg: "Branch and discount applied to all tests successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message
        });
    }
};

exports.removeBranchByBranchId = async (req, res) => {
    try {
        const BranchId = req.params.id;

        // Check if BranchId is provided
        if (!BranchId) {
            return res.status(400).json({
                success: false,
                msg: "No Branch ID provided"
            });
        }

        // Remove entries in testModel where Branch.labBranchId matches BranchId
        const filterBranchAndRemove = await testModel.deleteMany({ 'Branch.labBranchId': BranchId });

        res.status(200).json({
            success: true,
            msg: `Removed entries where Branch ID ${BranchId} matched`,
            deletedCount: filterBranchAndRemove.deletedCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message
        });
    }
};


exports.getAllTestsForBranch = async (req, res) => {
    try {
        const BranchId = req.params.id;
        // console.log(BranchId)
        if (!BranchId) {
            return res.status(403).json({
                success: false,
                msg: "No Branch id is Given"
            });
        }

        // Fetch all tests
        const tests = await testModel.find();

        // Filter tests to include the branch's discount
        const testsWithDiscount = tests.map(test => {
            const branch = test.Branch.find(branch => branch.labBranchId.toString() === BranchId);
            console.log("Branches", branch)
            if (branch) {
                return {
                    ...test._doc,
                    actualPrice: test.actualPrice - (test.actualPrice * branch.HowManyDiscountAppliedForThisLab / 100)
                };
            }
            return test;
        });
        // console.log(testsWithDiscount)
        res.status(200).json({
            success: true,
            tests: testsWithDiscount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message
        });
    }
};



exports.searchByTestName = async (req, res) => {
    try {
        const userInput = req.params.input;

        // Validate user input
        if (!userInput) {
            return res.status(400).json({
                success: false,
                msg: "No input provided"
            });
        }

        // Case-insensitive search using regex
        const regex = new RegExp(userInput, 'i');

        // Search for tests matching userInput
        const tests = await testModel.find({ testName: regex });

        // Prepare response data array
        const results = [];

        // Iterate through found tests
        for (const test of tests) {
            const result = {
                testName: test.testName,
                labDetails: [],
                branchDetails: []
            };

            // Find labs associated with the test (assuming lab details are in another model)
            const labs = await Labs.find();
            // console.log(labs.discountPercentage)
            // Calculate discounted prices for labs based on general discount percentage
            // console.log("Discounts",generalDiscountedPriceForLabs)
            // Add lab details to result    
            result.labDetails = labs.map(lab => ({
                labId: lab._id,
                labName: lab.LabName,
                labLocation: lab.address,
                labLat: lab.Latitude,
                labLang: lab.Longitude,
                testPrice: test.actualPrice,
                discountedPrice: test.actualPrice - (test.actualPrice * (lab.discountPercentage / 100)).toFixed(0), // Use general discount for labs
                discountPercentage: lab.discountPercentage
            }));

            // Calculate discounted prices for each test based on branch discounts
            for (const branch of test.Branch) {
                const branchDetails = await Branch.findById(branch.labBranchId);

                if (branchDetails) {
                    const discountedPrice = test.actualPrice - (test.actualPrice * (branch.HowManyDiscountAppliedForThisLab / 100));

                    result.branchDetails.push({
                        labBranchId: branch.labBranchId,
                        branchName: branchDetails.LabName,
                        labLat: branchDetails.Latitude,
                        labLang: branchDetails.Longitude,
                        branchLocation: branchDetails.address,
                        HowManyDiscountAppliedForThisLab: branch.HowManyDiscountAppliedForThisLab,
                        discountedPrice: discountedPrice
                    });
                }
            }

            results.push(result);
        }

        res.status(200).json({
            success: true,
            msg: "Search results for test names",
            data: results
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message
        });
    }
};