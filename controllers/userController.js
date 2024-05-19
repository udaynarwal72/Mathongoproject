const { response } = require('express');
const UserDetail = require('../model/userModel');
const userlist = require('../model/userlist');
// const mongoose = require('mongoose');   // Make sure to import mongoose
const csv = require('csvtojson');
const { all } = require('../routes/userRoutes');
const importUser = async (req, res) => {
    try {

        var userData = [];
        console.log(req.file.path);

        csv()
            .fromFile(req.file.path)
            .then(async (response) => {
                const csvKey = Object.keys(response[0]);
                console.log(csvKey);
                const lists = await userlist.find();
                const propertyTitleLength = lists[0].customProperties.length;
                console.log(propertyTitleLength);
                const allCustomPropertiesTitles = [];

                lists.forEach(list => {
                    list.customProperties.forEach(property => {
                        allCustomPropertiesTitles.push(property.title);
                    });
                });
                console.log(allCustomPropertiesTitles);

                const propertytitle = lists[0].customProperties[0].title;
                const propertydefault = lists[0].customProperties[0].defaultValue;
                var valueToTake = [];
                valueToTake.push('name', 'email');
                // console.log(lists[0].customProperties); //array of objects

                // pushing value present in custompropertis of list to valueToTake array using loop
                for (var i = 0; i < lists.length; i++) {
                    for (var j = 0; j < lists[i].customProperties.length; j++) {
                        valueToTake.push(lists[i].customProperties[j].title);
                    }



                    // for (var x = 0; x < propertyTitleLength; x++) {
                    //     if (allCustomPropertiesTitles.includes(csvKey[x])) {
                    //         valueToTake.push(csvKey[x]);
                    //     }
                    // }
                    console.log(valueToTake);
                    console.log(propertydefault);
                    console.log(lists.length);

                    // // for (var z = 0; z < lists.length; z++) {// z is used to iterate over the list
                    // for (var x = 0; x < response.length; x++) {// x is used for iterating over the response
                    //     var obj = {};
                    //     for (var y = 0; y < valueToTake.length; y++) {// y is used to iterate over the valueToTake
                    //         if (response[x][valueToTake[y]] == '') {
                    //             response[x][valueToTake[y]] = lists[z].customProperties[y].defaultValue;
                    //         }
                    //         console.log(csvkey[y]);
                    //         obj[valueToTake[y]] = response[x][valueToTake[y]];
                    //     }
                    //     userData.push(obj);
                    // }
                    // }
                    // pushing name, email, and other requried values form the csv file to the userData array using loop
                    for (var x = 0; x < response.length; x++) {
                        var obj = {};
                        for (var y = 0; y < valueToTake.length; y++) {
                            // cheking if name present in response is empty or not 

                            if (response[x][valueToTake[y]] == '' && !(valueToTake[y] == 'name') && !(valueToTake[y] == 'email')) {
                                response[x][valueToTake[y]] = propertydefault;
                            }
                            obj[valueToTake[y]] = response[x][valueToTake[y]];
                        }
                        userData.push(obj);
                    }
                    //adding the data to the database
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
                        // Now you can insert userData into the database
                        await UserDetail.insertMany(userData);
                        console.log('Data inserted successfully');
                        // Move the response sending outside of the loop
                        res.send({ status: 200, success: true, message: 'Data inserted successfully' });
                    } catch (err) {
                        res.send({ status: 400, sucess: false, message: err.message })
                    }
                }
            })
    } catch (err) {
        res.send({ status: 400, sucess: false, message: err.message })
    }
}
module.exports = {
    importUser
}