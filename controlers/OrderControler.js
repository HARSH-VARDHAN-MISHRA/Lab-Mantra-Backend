const OrderTestModel = require("../models/OrderTest.model");

// Get All Order
exports.getAllOrders = async (req, res) => {
    try {
        const AllOrders = await OrderTestModel.find();
        if (AllOrders === 0) {
            return res.status(400).json({
                success: true,
                message: "Orders Not Avilable Now !!"
            })
        }
        res.status(201).json({
            success: true,
            data: AllOrders,
            msg: "All Orders Found"
        })
    } catch (error) {
        console.log("Error : ".error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error !!"
        })
    }
}
exports.getOrderByUserId = async (req, res) => {
    try {
        const {id} = req.params
        const AllOrders = await OrderTestModel.find({PatientId:id});
        if (AllOrders === 0) {
            return res.status(400).json({
                success: true,
                message: "Orders Not Avilable Now !!"
            })
        }
        res.status(201).json({
            success: true,
            data: AllOrders,
            msg: "All Orders Found"
        })
    } catch (error) {
        console.log("Error : ".error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error !!"
        })
    }
}

// Delete Order
exports.deleteOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const checkOrder = await OrderTestModel.deleteOne({ _id: id })
        if (!checkOrder) {
            return res.status(403).json({
                success: false,
                msg: "Order Not Found"
            })
        }
        res.status(200).json({
            success: true,
            msg: "Order Deleted Succesfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.deleteAllOrder = async (req, res) => {
    try {
        const deleteResult = await OrderTestModel.deleteMany();

        if (deleteResult.deletedCount === 0) {
            return res.status(403).json({
                success: false,
                msg: "No Orders Found to Delete"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Orders Deleted Successfully !!"
        });
    } catch (error) {
        console.error("Error deleting orders:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get Order by ID
exports.GetMyOrder = async (req, res) => {
    try {
        const user = req.user;
        const foundOrders = await Orders.find({ 'UserInfo.userid': user._id });

        res.status(200).json({
            success: true,
            msg: "Orders Found Successfully",
            data: foundOrders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
 };