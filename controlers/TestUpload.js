const LaboratoryDetail = require('../models/laboratory.model');
const xlsx = require('xlsx');
const path = require('path');

// Function to format the data
function formatData(data) {
    const formattedData = [];

    data.forEach((row, index) => {
        if (index === 0) return; // Skip header row

        if (row.length >= 3) {
            const srNo = row[0];
            const testName = row[1];
            let price = row[2];
            let discountPercentage = row[3] || 0; // Default to 0 if not provided
            let discountPrice = row[4] || 0; // Default to 0 if not provided

            // Remove commas and convert to number
            if (typeof price === 'string') {
                price = parseFloat(price.replace(/,/g, ''));
            }
            if (typeof discountPercentage === 'string') {
                discountPercentage = parseFloat(discountPercentage.replace(/,/g, ''));
            }
            if (typeof discountPrice === 'string') {
                discountPrice = parseFloat(discountPrice.replace(/,/g, ''));
            }

            formattedData.push({
                testNo: srNo,
                TestName: testName,
                Price: price,
                DiscountPercentage: discountPercentage,
                DiscountPrice: discountPrice
            });
        }
    });

    return formattedData;
}

exports.UploadXlsxFileAndExtractData = async (req, res) => {
    try {
        const ExcelFile = req.file;
        if (!ExcelFile) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const workbook = xlsx.readFile(ExcelFile.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        const formattedData = formatData(jsonData);
        console.log(formattedData);
        // Assuming labId is passed in the request body to identify which laboratory to update
        const { labId } = req.body;

        if (!labId) {
            return res.status(400).json({ success: false, message: 'No labId provided' });
        }

        // Find the laboratory and update tests
        const lab = await LaboratoryDetail.findById(labId);
        if (!lab) {
            return res.status(404).json({ success: false, message: 'Laboratory not found' });
        }

        // Add new tests to the laboratory's tests array
        lab.tests.push(...formattedData);

        // Save the laboratory with new tests
        await lab.save();

        res.status(200).json({ success: true, message: 'File uploaded and data extracted successfully', data: formattedData });
    } catch (error) {
        console.error('Error processing file', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.UpdateTestDetails = async (req, res) => {
    try {
        const testId = req.params.id;
        if (!testId) {
            return res.status(400).json({ success: false, message: 'No Test id provided' });
        }
        console.log(req.body);
        const { Price, TestName, DiscountPercentage, DiscountPrice } = req.body;
        if (Price === undefined && TestName === undefined && DiscountPercentage === undefined && DiscountPrice === undefined) {
            return res.status(400).json({ success: false, message: 'No data provided to update' });
        }

        // Find the laboratory containing the test
        const lab = await LaboratoryDetail.findOne({ 'tests._id': testId });
        if (!lab) {
            return res.status(404).json({ success: false, message: 'Test not found' });
        }

        // Find the specific test
        const test = lab.tests.id(testId);
        if (!test) {
            return res.status(404).json({ success: false, message: 'Test not found' });
        }

        // Update only the provided fields
        if (Price !== undefined) {
            test.Price = Price;
        }
        if (TestName !== undefined) {
            test.TestName = TestName;
        }
        if (DiscountPercentage !== undefined) {
            test.DiscountPercentage = DiscountPercentage;
        }
        if (DiscountPrice !== undefined) {
            test.DiscountPrice = DiscountPrice;
        }

        // Save the laboratory with the updated test details
        await lab.save();

        res.status(200).json({ success: true, message: 'Test details updated successfully', test });
    } catch (error) {
        console.error('Error updating test details', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.singleTestDeleteByTestId = async (req, res) => {
    try {
        const testId = req.params.id;
        if (!testId) {
            return res.status(400).json({ success: false, message: 'No Test id provided' });
        }

        // Find the laboratory containing the test
        const lab = await LaboratoryDetail.findOne({ 'tests._id': testId });
        if (!lab) {
            return res.status(404).json({ success: false, message: 'Test not found' });
        }

        // Remove the test from the laboratory's tests array
        lab.tests.id(testId).deleteOne();

        // Save the laboratory with the updated tests array
        await lab.save();

        res.status(200).json({ success: true, message: 'Test deleted successfully' });
    } catch (error) {
        console.error('Error deleting test', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.DeleteAllTestsByLabId = async (req, res) => {
    try {
        const { labId } = req.params;

        if (!labId) {
            return res.status(400).json({ success: false, message: 'No labId provided' });
        }

        // Find the laboratory by labId
        const lab = await LaboratoryDetail.findById(labId);
        if (!lab) {
            return res.status(404).json({ success: false, message: 'Laboratory not found' });
        }

        // Clear the tests array
        lab.tests = [];

        // Save the laboratory with the updated tests array
        await lab.save();

        res.status(200).json({ success: true, data: lab, message: 'All tests deleted successfully' });
    } catch (error) {
        console.error('Error deleting tests', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getALLTestByLabId = async (req, res) => {
    try {
        const labId = req.params.labId;
        if (!labId) {
            return res.status(400).json({ success: false, message: 'No labId provided' });
        }

        // Find the laboratory by its ID
        const lab = await LaboratoryDetail.findById(labId);
        if (!lab) {
            return res.status(404).json({ success: false, message: 'Laboratory not found' });
        }

        // Return all tests associated with the laboratory
        const tests = lab.tests;

        res.status(200).json({ success: true, tests });
    } catch (error) {
        console.error('Error fetching tests by labId', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getSingleTestByTestId = async (req, res) => {
    try {
        const testId = req.params.id;

        if (!testId) {
            return res.status(400).json({ success: false, message: 'No Test id provided' });
        }

        // Find the laboratory containing the test with the provided testId
        const lab = await LaboratoryDetail.findOne({ 'tests._id': testId });

        if (!lab) {
            return res.status(404).json({ success: false, message: 'Test not found' });
        }

        // Extract the specific test from the laboratory tests array
        const test = lab.tests.find(test => test._id.toString() === testId);

        if (!test) {
            return res.status(404).json({ success: false, message: 'Test not found' });
        }

        res.status(200).json({ success: true, data: test, message: 'Test found successfully' });
    } catch (error) {
        console.error('Error fetching test', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};