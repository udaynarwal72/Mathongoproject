// const UserDetail = require('../model/userModel');

// const userUnsubscribe = async (req, res) => {

//     //finding user by id
//     const user
//         = await
//             UserDetail.findById(req.params.id);
//     if (!user) {
//         return res.status(404).send("User not found");
//     }
//     user.pushemail = false; // Set pushemail to false
//     res.send("Unsubscribe");
// }

// module.exports = {
//     userUnsubscribe
// }

const UserDetail = require('../model/userModel');

const userUnsubscribe = async (req, res) => {
    try {
        // Finding user by id
        const user = await UserDetail.findById(req.params.id);
        console.log(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        
        // Set pushemail to false
        user.pushemail = false;
        
        // Save the updated user object to the database
        await user.save();

        res.send("Unsubscribed");
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    userUnsubscribe
};
