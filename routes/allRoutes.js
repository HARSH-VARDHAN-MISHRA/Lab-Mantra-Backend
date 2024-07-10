const express = require('express');
const { createTest, getAllTest, deleteTest, updateTest } = require('../controlers/TestControler');
const { createPackageTitle, getAllPackageTitle, deletePackageTitle, updatePackageTitle } = require('../controlers/packageTitleControler');
const { createTestCategory, getAllTestCategory, deleteTestCategory, updateTestCategory } = require('../controlers/TestCategoryControler');
const { createPackage, getAllPackage, deletePackage, updatePackage } = require('../controlers/packageControler');
const { createLaboratory, getLaboratories, findNearestLaboratories, updateLabLocations, getLabInformationByCityAndPinCode, deleteLaboratory } = require('../controlers/laboratoryControler');
const { register, PasswordChangeRequest, ResendOtp, ResendSignOtp, verifyOtpForSignIn, VerifyOtp, LoginUser, getAllUsers } = require('../controlers/UserControler');
const { getAllVouchers, applyVoucher, createVoucher, activateVoucher, deactivateVoucher, deleteVoucher } = require('../controlers/VoucherController');
const { checkout, paymentVerification } = require('../controlers/PaymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { getAllOrders, deleteOrder } = require('../controlers/OrderControler');
const { createBranchLaboratory, getBranchLaboratories, findNearestBranchLaboratories, updateBranchLabLocations, getBranchLabInformationByCityAndPinCode, deleteBranchLaboratory } = require('../controlers/LaboratoryBranchControler');

const route = express.Router();

// -- Authentication ---- 
route.post("/register", register) // create Account

route.post('/Password-change-request', PasswordChangeRequest);
route.post('/Resend-Otp', ResendOtp);
route.post('/Verify-sign-Otp', verifyOtpForSignIn);
route.post('/resend-sign-Otp', ResendSignOtp);
route.post('/Verify-Otp/:email/:newPassword', VerifyOtp)

route.post("/login", LoginUser);
route.get("/all-users", getAllUsers);

// Test
route.post("/create-test",createTest );
route.get("/get-all-test",getAllTest );
route.delete("/delete-test/:id",deleteTest );
route.put("/update-test/:id",updateTest );

// Package Title
route.post("/create-package-title",createPackageTitle );
route.get("/get-all-package-title",getAllPackageTitle );
route.delete("/delete-package-title/:id",deletePackageTitle );
route.put("/update-package-title/:id",updatePackageTitle );

// Test Group
route.post("/create-test-category",createTestCategory );
route.get("/get-all-test-category",getAllTestCategory );
route.delete("/delete-test-category/:id",deleteTestCategory );
route.put("/update-test-category/:id",updateTestCategory );

// Package
route.post("/create-package",createPackage );
route.get("/get-all-package",getAllPackage );
route.delete("/delete-package/:id",deletePackage );
route.put("/update-package/:id",updatePackage );

// Laboratory
route.post('/create-laboratory', createLaboratory);
route.get('/get-all-laboratories', getLaboratories);
route.get('/nearest-laboratories', findNearestLaboratories);
route.post('/lab-address-update', updateLabLocations);
route.get('/lab-info-by-pincode', getLabInformationByCityAndPinCode);
route.delete('/delete-laboratory/:id', deleteLaboratory);

// Branch Laboratory
route.post('/create-branch-laboratory', createBranchLaboratory);
route.get('/get-all-branch-laboratories', getBranchLaboratories);
route.get('/nearest-branch-laboratories', findNearestBranchLaboratories);
route.post('/branch-lab-address-update', updateBranchLabLocations);
route.get('/branch-lab-info-by-pincode', getBranchLabInformationByCityAndPinCode);
route.get('/delete-branch-laboratory/:id', deleteBranchLaboratory);

//====================VOUCHERS====================================//
route.get('/vouchers', getAllVouchers)
route.post('/apply-vouchers', applyVoucher)
route.post('/vouchers/create-vouchers', createVoucher)
route.put('/vouchers/activateVoucher/:id', activateVoucher)
route.put('/vouchers/deactivateVoucher/:id', deactivateVoucher)
route.delete('/vouchers/deleteVoucher/:id', deleteVoucher)

// ===================Payment ==========================//
route.post('/Create-payment',isAuthenticatedUser,checkout)
route.post('/paymentverification',paymentVerification)

// ======== Orders ======= //
route.get('/all-orders',getAllOrders)
route.delete('/delete-order/:id',deleteOrder)

module.exports = route