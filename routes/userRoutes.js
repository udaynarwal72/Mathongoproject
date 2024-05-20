// const express = require('express');
// const { response } = require('express');
// const router = express.Router();

// const multer = require('multer');
// const path = require('path');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(express.static(path.resolve(process.cwd(), 'public')));//to access the files in public folder
// router.use(express.json());

// router.use(cors({
//     origin: ["https://mathongoproject.vercel.app"],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true

// }));

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const pathway = path.resolve(process.cwd(), 'public/uploads/');
//         cb(null, pathway);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });

// const upload = multer({ storage: storage });
// //1st task
// router.post('/', (req, res) => {
//     res.send('Hello World');
// });
// const userlist = require('../controllers/userListController');
// router.post('/userlist', userlist.createList);
// //2nd task
// const userController = require('../controllers/userController');
// router.post('/importuser', upload.single('usercsv'), userController.importUser);

// //bonus task
// const sendMail = require('../controllers/userEmailSend');

// router.post('/sendemail', sendMail.sendUserEmail);

// //importing pushUserHeadToDatabase function from userHeaderDetail.js
// const userHead = require('../controllers/userEmailSend');
// const UserHeaderDetail = require('../controllers/userListController');
// router.post('/userhead', UserHeaderDetail.createList);
// const userunsubscribe = require('../controllers/userUnsubscribe');
// router.get('/unsubscribe/:id', userunsubscribe.userUnsubscribe);

// module.exports = router;
const express = require('express');
const { response } = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

// Middleware setup
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(process.cwd(), 'public'))); // to access the files in public folder
router.use(express.json());
router.use(cors({
    origin: ["https://mathongoproject.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Ensure the /tmp/uploads directory exists
const tmpUploadsPath = path.resolve('/tmp/uploads/');
if (!fs.existsSync(tmpUploadsPath)) {
    fs.mkdirSync(tmpUploadsPath, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tmpUploadsPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes
router.post('/', (req, res) => {
    res.send('Hello World');
});

const userlist = require('../controllers/userListController');
router.post('/userlist', userlist.createList);

const userController = require('../controllers/userController');
router.post('/importuser', upload.single('usercsv'), userController.importUser);

const sendMail = require('../controllers/userEmailSend');
router.post('/sendemail', sendMail.sendUserEmail);

const userHead = require('../controllers/userEmailSend');
const UserHeaderDetail = require('../controllers/userListController');
router.post('/userhead', UserHeaderDetail.createList);

const userunsubscribe = require('../controllers/userUnsubscribe');
router.get('/unsubscribe/:id', userunsubscribe.userUnsubscribe);

module.exports = router;
