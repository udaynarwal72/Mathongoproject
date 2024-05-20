
const { response } = require('express');
const UserDetail = require('../model/userModel');
const userlist = require('../model/userlist');
const csv = require('csvtojson');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const path = require('path');

// Function to write errors to a CSV file
const writeErrorToCSV = (errors) => {
    // const localFilePath = path.join(
    //     process.cwd(), 
    //     process.env.NODE_ENV === 'production' ? 'static' : 'public',
    //     'usercsv.csv'
    // )
    const csvFilePath = path.resolve('/tmp/', 'error_log.csv');
    const errorData = errors.map(error => ({
        'Error Message': error.message,
        'User Data': JSON.stringify(error.userData)
    }));

    const csvContent = json2csv({data: errorData,fields: ['Error Message', 'User Data']});
    fs.writeFileSync(csvFilePath, csvContent, { flag: 'a' });
    return csvFilePath;
};

const importUser = async (req, res) => {
    try {
        var userData = [];
        console.log(req.file.path);
        const filepath =  req.file.path;
        console.log(filepath);
        const response = await csv().fromFile(filepath);
        const csvKey = Object.keys(response[0]);
        const lists = await userlist.find();
        const propertyTitleLength = lists[0].customProperties.length;
        const allCustomPropertiesTitles = [];
        lists.forEach(list => {
            list.customProperties.forEach(property => {
                allCustomPropertiesTitles.push(property.title);
            });
        });
        const propertydefault = lists[0].customProperties[0].defaultValue;
        var valueToTake = ['name', 'email'];

        // Pushing value present in customProperties of list to valueToTake array
        lists.forEach(list => {
            list.customProperties.forEach(property => {
                valueToTake.push(property.title);
            });
        });

        response.forEach(row => {
            var obj = {};
            valueToTake.forEach(field => {
                obj[field] = row[field] === '' && field !== 'name' && field !== 'email' ? propertydefault : row[field];
            });
            userData.push(obj);
        });

        console.log(userData);

        try {
            const existingKeys = Object.keys(UserDetail.schema.paths);
            const userDataKeys = Object.keys(userData[0]);
            const newKeys = userDataKeys.filter(key => !existingKeys.includes(key));
            newKeys.forEach(newKey => {
                UserDetail.schema.add({ [newKey]: String });
            });
            await UserDetail.init();

            let successCount = 0;
            let failCount = 0;
            const errors = [];

            for (const user of userData) {
                try {
                    await UserDetail.create(user);
                    successCount++;
                } catch (error) {
                    failCount++;
                    errors.push({ message: error.message, userData: user });
                }
            }

            const csvFilePath = writeErrorToCSV(errors);
            const totalUserCount = await UserDetail.countDocuments();

            res.send({
                status: 200,
                success: true,
                message: 'User import completed',
                successfullyAdded: successCount,
                failedToAdd: failCount,
                totalUsersInDatabase: totalUserCount,
                errorLogFile: csvFilePath
            });
        } catch (err) {
            const csvFilePath = writeErrorToCSV([{ message: err.message, userData: {} }]);
            res.status(400).send({
                success: false,
                message: err.message,
                successfullyAdded: 0,
                failedToAdd: userData.length,
                totalUsersInDatabase: await UserDetail.countDocuments(),
                errorLogFile: csvFilePath
            });
        }
    } catch (err) {
        const csvFilePath = writeErrorToCSV([{ message: err.message, userData: {} }]);
        res.status(400).send({
            success: false,
            message: err.message,
            successfullyAdded: 0,
            failedToAdd: 0,
            totalUsersInDatabase: await UserDetail.countDocuments(),
            errorLogFile: csvFilePath
        });
    }
};

module.exports = {
    importUser,
};
