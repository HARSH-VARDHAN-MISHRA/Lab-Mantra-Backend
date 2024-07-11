const contactModel = require("../models/contact.model");

exports.createEnquiryForm = async (req,res) =>{
    try {
        console.log(req.body);
        const {firstName ,lastName ,phoneNumber ,email_id ,address} = req.body;

        const newInquiry = new contactModel({
            firstName ,lastName ,phoneNumber ,email_id ,address
        })
        await newInquiry.save();
        return res.status(200).json({
            success:true,
            message:"Inquiry Send Successfully !!"
        })

    } catch (error) {
        console.log("Error While Sending the Enquiry :",error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

exports.getAllEnquiryForm = async (req,res) =>{
    try {
        const allEnquiries = await contactModel.find();

        if(allEnquiries.length === 0){
            return res.status(403).json({
                success:true,
                message:"Enquiry Not Avilable"
            })
        }

        res.status(200).json({
            success:true,
            data:allEnquiries,
            message:"All Enquries Found"
        })

    } catch (error) {
        console.log("Internal Server Error",error)
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}


exports.deleteEnquiryById = async (req,res) =>{
    try {
        const id = req.params.id;

        const checkDeletedId = await contactModel.findByIdAndDelete({_id : id});
        if(!checkDeletedId){
            return res.status(403).json({
                success:false,
                message:"Enquiry Not Found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Enquiry Deleted Successfully !!"
        })
    } catch (error) {
        console.log("Error While Deleting the Enquiry :", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}