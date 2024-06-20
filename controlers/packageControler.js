const packageModel = require("../models/package.model");


// create Package
exports.createPackage = async (req,res) =>{
    try {
        console.log(req.body);
        const { packageName,testQuantity,testGroupQuantity,currentPrice,actualPrice,testCategoryName,offPercentage} = req.body;

        if(!packageName){
            return res.status(403).json({
                success: false,
                message: "Please Provide All Fields !!"
            })
        }

        const existingPackage = await packageModel.findOne({packageName : packageName});
        if (existingPackage) {
            return res.status(403).json({
                success: false,
                message: "Package Already Exists !!"
            });
        }
        const newPackage = new packageModel({
            packageName,
            testQuantity,
            testGroupQuantity,
            currentPrice,
            actualPrice,
            testCategoryName,
            offPercentage
        })
        await newPackage.save();
        res.status(200).json({
            success: true,
            data: newPackage,
            message: "Package Created Successfully !!"
        })

    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Get All Package
exports.getAllPackage = async (req,res) =>{
    try {
        const getAllPackage = await packageModel.find();
        if (getAllPackage.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Package Not Found"
            })
        }
        res.status(200).json({
            success: true,
            data: getAllPackage,
            message: "All Package Found"
        })

    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Delete Package
exports.deletePackage = async (req, res) => {
    try {
        const id = req.params.id;
        const checkPackage = await packageModel.deleteOne({ _id: id })
        if (!checkPackage) {
            return res.status(403).json({
                success: false,
                message: "Package Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Package Deleted Succesfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Update Package
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
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}