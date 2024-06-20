const express = require('express');
const { createTest, getAllTest, deleteTest, updateTest } = require('../controlers/TestControler');
const { createPackageTitle, getAllPackageTitle, deletePackageTitle, updatePackageTitle } = require('../controlers/packageTitleControler');
const { createTestCategory, getAllTestCategory, deleteTestCategory, updateTestCategory } = require('../controlers/TestCategoryControler');
const { createPackage, getAllPackage, deletePackage, updatePackage } = require('../controlers/packageControler');
const { createLaboratory, getLaboratories, findNearestLaboratories } = require('../controlers/laboratoryControler');

const route = express.Router();

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

route.post('/create-laboratory', createLaboratory);
route.get('/get-all-laboratories', getLaboratories);
route.get('/nearest-laboratories', findNearestLaboratories);

module.exports = route