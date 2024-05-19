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
//                 console.log(userData);
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
//                     await UserDetail.init();
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
//     importUser,
// }

const { response } = require('express');
const UserDetail = require('../model/userModel');
const userlist = require('../model/userlist');
const csv = require('csvtojson');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const path = require('path');

// Function to write errors to a CSV file
const writeErrorToCSV = (error) => {
    const csvFilePath = path.join(__dirname, 'error_log.csv');
    const errorData = [{
        "Error Message": error.message
    }];
    const csvData = json2csv(errorData, { fields: ["Error Message"] });
    fs.writeFileSync(csvFilePath, csvData, { flag: 'a' });
    return csvFilePath;
};

const importUser = async (req, res) => {
    try {
        const userData = [];
        console.log(req.file.path);

        const response = await csv().fromFile(req.file.path);

        const csvKeys = Object.keys(response[0]);
        const lists = await userlist.find();
        const allCustomPropertiesTitles = lists.flatMap(list =>
            list.customProperties.map(property => property.title)
        );

        const propertyDefault = lists[0].customProperties[0].defaultValue;
        const valueToTake = ['name', 'email', ...allCustomPropertiesTitles];

        for (let i = 0; i < response.length; i++) {
            const record = response[i];
            const obj = {};
            for (let j = 0; j < valueToTake.length; j++) {
                const key = valueToTake[j];
                obj[key] = record[key] || (key !== 'name' && key !== 'email');
            }
            userData.push(obj);
        }

        console.log(userData);

        try {
            // Fetch the existing keys in the schema
            const existingKeys = Object.keys(UserDetail.schema.paths);
            // Fetch the keys present in the userData
            const userDataKeys = Object.keys(userData[0]);
            // Identify new keys that are not present in the schema
            const newKeys = userDataKeys.filter(key => !existingKeys.includes(key));
            // Dynamically update the schema to include new keys
            newKeys.forEach(newKey => {
                UserDetail.schema.add({ [newKey]: String }); // Assuming all new fields are strings
            });
            // Save the updated schema
            await UserDetail.init();
            // Insert userData into the database
            await UserDetail.insertMany(userData);
            console.log('Data inserted successfully');
            res.send({ status: 200, success: true, message: 'Data inserted successfully' });
        } catch (err) {
            const csvFilePath = writeErrorToCSV(err);
            res.status(400).send({ success: false, message: err.message });
        }
    } catch (err) {
        const csvFilePath = writeErrorToCSV(err);
        res.status(400).send({ success: false, message: err.message });
    }
};

module.exports = {
    importUser,
};
