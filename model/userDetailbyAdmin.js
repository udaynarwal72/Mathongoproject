const { default: mongoose } = require('mongoose');
const response = require('mongoose');

const detailByAdmin = new mongoose.Schema({
    adminFieldInput: {
        type: String,
        required: false,
    },
    adminDefaultValue: {
        type: String,
        required: false,
    }
})

const UserHeaderDetail = mongoose.model('UserHeaderDetail', detailByAdmin);

module.exports = UserHeaderDetail;