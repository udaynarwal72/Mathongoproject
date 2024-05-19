// routes/listRoutes.js
const express = require('express');
const List = require('../model/userlist');

// Create a new list
const createList = async (req, res) => {
    try {
        console.log(req.body);
        //checking if req.body.title is already present in the database
        const list = await List.findOne
            ({
                title: req.body.title
            });
        if (list) {
            return res.status(400).json({ message: "List already exists" });
        }
        try {
            const newList = new List(req.body);
            await newList.save();
            res.status(201).json(newList);
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: message.err });
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: "error" });
    }
}

module.exports = { createList };
