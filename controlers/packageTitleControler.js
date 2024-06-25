const packageTitleModel = require("../models/packageTitle.model");
const testModel = require("../models/test.model");
// create Package Title
exports.createPackageTitle = async (req,res) =>{
    try {
        console.log(req.body);
        const { packageTitle , packages , packagesQuantity} = req.body;
        console.log(req.body)
        if(!packageTitle ){
            return res.status(403).json({
                success: false,
                message: "Please Provide All Fields !!"
            })
        }

        const existingTest = await packageTitleModel.findOne({packageTitle : packageTitle});
        if (existingTest) {
            return res.status(403).json({
                success: false,
                message: "Package Title Already Exists !!"
            });
        }
        
        const newTest = new packageTitleModel({
            packageTitle,
            packagesId:packages,
            packagesQuantity
        })
        await newTest.save();
        res.status(200).json({
            success: true,
            data: newTest,
            message: "Package Title Created Successfully !!"
        })

    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Get All Package Title
exports.getAllPackageTitle = async (req, res) => {
    try {
        const getAllTest = await packageTitleModel.find().populate('packagesId');
        if (getAllTest.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Package Title Not Found"
            });
        }

        const transformedTitles = await Promise.all(getAllTest.map(async (title) => {
            const packageDetails = await Promise.all(title.packagesId.map(async (packageId) => {
                const testDetails = await testModel.find({ _id: packageId });
                return {
                    packageId,
                    testDetails
                };
            }));

            return {
                ...title.toObject(),
                packageDetails
            };
        }));

        res.status(200).json({
            success: true,
            data: transformedTitles,
            message: "All Package Title Found"
        });

    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Delete Package Title
exports.deletePackageTitle = async (req, res) => {
    try {
        const id = req.params.id;
        const checkTestTitle = await packageTitleModel.deleteOne({ _id: id })
        if (!checkTestTitle) {
            return res.status(403).json({
                success: false,
                message: "Package Title Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Package Title Deleted Succesfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Update Package Title
exports.updatePackageTitle = async (req, res) => {
    try {
        const packageTitleId = req.params.id;
        const updates = req.body;
        console.log("Incoming Data", updates);

        // Modify packagesId array to convert label strings to ObjectId types
        if (updates.packages) {
            updates.packagesId = updates.packages.map(package => package.label);
            delete updates.packages; // Remove the 'packages' property from updates
        }

        // Check if there are no fields to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update."
            });
        }

        const options = { new: true }; // Return the modified document
        const updatedPackageTitle = await packageTitleModel.findByIdAndUpdate(packageTitleId, updates, options);
        if (!updatedPackageTitle) {
            return res.status(404).json({
                success: false,
                message: "Package Title not found."
            });
        }

        console.log("Update Data", updatedPackageTitle);
        res.status(200).json({
            success: true,
            message: "Package Title updated successfully.",
            data: updatedPackageTitle
        });
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
