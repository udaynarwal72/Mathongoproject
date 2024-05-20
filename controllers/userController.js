// const { response } = require('express');
// const UserDetail = require('../model/userModel');
// const userlist = require('../model/userlist');
// // const mongoose = require('mongoose');   // Make sure to import mongoose
// const csv = require('csvtojson');
// const json2csv = require('json2csv').parse;
// const fs = require('fs');
// const path = require('path');
// // Function to write errors to a CSV file
// const writeErrorToCSV = (error) => {
//     const csvFilePath = path.join(__dirname, 'error_log.csv');
//     const errorData = `"Error Message"\n"${error.message}"\n`;
//     json2csv({ data: errorData, fields: ["Error Message"] });
//     // Write error data to CSV file
//     fs.writeFileSync(csvFilePath, errorData, { flag: 'a' });
//     return csvFilePath;
// };

// const importUser = async (req, res) => {
//     try {

//         var userData = [];
//         console.log(req.file.path);

//         csv()
//             .fromFile(req.file.path)
//             .then(async (response) => {
//                 const csvKey = Object.keys(response[0]);
//                 const lists = await userlist.find();
//                 const propertyTitleLength = lists[0].customProperties.length;
//                 const allCustomPropertiesTitles = [];
//                 lists.forEach(list => {
//                     list.customProperties.forEach(property => {
//                         allCustomPropertiesTitles.push(property.title);
//                     });
//                 });

//                 const propertytitle = lists[0].customProperties[0].title;
//                 const propertydefault = lists[0].customProperties[0].defaultValue;
//                 var valueToTake = [];
//                 valueToTake.push('name', 'email');

//                 // pushing value present in custompropertis of list to valueToTake array using loop
//                 for (var i = 0; i < lists.length; i++) {
//                     for (var j = 0; j < lists[i].customProperties.length; j++) {
//                         valueToTake.push(lists[i].customProperties[j].title);
//                     }
//                     for (var x = 0; x < response.length; x++) {
//                         var obj = {};
//                         for (var y = 0; y < valueToTake.length; y++) {
//                             // cheking if name present in response is empty or not 

//                             if (response[x][valueToTake[y]] == '' && !(valueToTake[y] == 'name') && !(valueToTake[y] == 'email')) {
//                                 response[x][valueToTake[y]] = propertydefault;
//                             }
//                             obj[valueToTake[y]] = response[x][valueToTake[y]];
//                         }
//                         userData.push(obj);
//                     }
//                     //adding the data to the database
//                 }
//                 try {
//                     // Fetch the existing keys in the schema
//                     const existingKeys = Object.keys(UserDetail.schema.paths);
//                     // Fetch the keys present in the userData
//                     const userDataKeys = Object.keys(userData[0]);
//                     // Identify new keys that are not present in the schema
//                     const newKeys = userDataKeys.filter(key => !existingKeys.includes(key));
//                     // Dynamically update the schema to include new keys
//                     newKeys.forEach(newKey => {
//                         UserDetail.schema.add({ [newKey]: String }); // Assuming all new fields are strings
//                     });
//                     // Save the updated schema
//                     const updateschema = await UserDetail.init();
//                     // Now you can insert userData into the database
//                     await UserDetail.insertMany(userData);
//                     console.log('Data inserted successfully');
//                     // Move the response sending outside of the loop
//                     res.send({ status: 200, success: true, message: 'Data inserted successfully' });
//                 } catch (err) {
//                     const csvFilePath = writeErrorToCSV(err);
//                     res.status(400).send({ sucess: false, message: err.message })
//                 }
//             })
//     } catch (err) {
//         const csvFilePath = writeErrorToCSV(err);
//         res.send({ status: 400, sucess: false, message: err.message })
//     }
// }
// module.exports = {
//     importUser
// }
const { response } = require('express');
const UserDetail = require('../model/userModel');
const userlist = require('../model/userlist');
const csv = require('csvtojson');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const path = require('path' );

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
    const csvContent = json2csv(errorData);
    fs.writeFileSync(csvFilePath, csvContent, { flag: 'a' });
    return csvFilePath;
};

const importUser = async (req, res) => {
    try {
        var userData = [];
        console.log(req.file.path);
        const filepath = path.resolve('/tmp/',req.file.path) ;
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
