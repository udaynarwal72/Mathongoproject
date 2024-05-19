const UserHeaderDetail = require('../model/userDetailbyAdmin'); // Assuming this is the correct model

// pushUserHeadToDatabase function is used to push the userHeaderDetail to the database
const pushUserHeadToDatabase = async (req, res) => {
    try {
        // Log the incoming request body for debugging
        console.log('Request Body:', req.body);

        // Validate request body
        if (!req.body.fields || !Array.isArray(req.body.fields)) {
            return res.status(400).send({ success: false, message: 'Invalid input: fields should be an array.' });
        }

        // Construct userHeadArray
        const userHeadArray = [];

        for (const field of req.body.fields) {
            // Check if adminFieldInput is unique
            const existingField = await UserHeaderDetail.findOne({ adminFieldInput: field.fieldName });

            if (!existingField) {
                userHeadArray.push({
                    adminFieldInput: field.fieldName,
                    adminDefaultValue: field.default,
                });
            }
        }
        // Insert userHeadArray into the database
        if (userHeadArray.length > 0) {
            await UserHeaderDetail.insertMany(userHeadArray);
            res.status(200).send({ success: true, message: "File uploaded successfully", data: userHeadArray });
        } else {
            res.status(200).send({ success: true, message: "No unique fields to add." });
        }
    } catch (err) {
        res.status(400).send({ success: false, message: err.message });
    }
};

module.exports = { pushUserHeadToDatabase };
