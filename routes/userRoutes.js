// const express = require('express');
// const { response } = require('express');
// const router = express.Router();

// const multer = require('multer');
// const path = require('path');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const fs = require('fs');
// const cb = require('cb');
// const uploadDir = path.resolve(__dirname, '../public/uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(express.static(path.resolve(__dirname, 'public')));//to access the files in public folder
// router.use(express.json());

// const filePath = path.resolve(__dirname, '../public/uploads');
// fs.chmod(filePath, 0o666)
//   .then(() => console.log('File mode changed to write'))
//   .catch(err => console.error('Error changing file mode:', err));

// router.use(cors({
//     origin: ["https://mathongoproject.vercel.app"],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
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
const router = express.Router();

const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

// Use the /tmp directory for file uploads in environments with read-only file systems
const uploadDir = path.resolve('/tmp/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware to parse request bodies
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// Serve static files from the public directory
router.use(express.static(path.resolve(__dirname, '../public')));

// CORS configuration
router.use(cors({
    origin: ["https://mathongoproject.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route to respond with "Hello World"
router.post('/', (req, res) => {
    res.send('Hello World');
});

// Import controllers
const userlist = require('../controllers/userListController');
router.post('/userlist', userlist.createList);

const userController = require('../controllers/userController');
router.post('/importuser', upload.single('usercsv'), userController.importUser);

const sendMail = require('../controllers/userEmailSend');
router.post('/sendemail', sendMail.sendUserEmail);

const UserHeaderDetail = require('../controllers/userListController');
router.post('/userhead', UserHeaderDetail.createList);

const userunsubscribe = require('../controllers/userUnsubscribe');
router.get('/unsubscribe/:id', userunsubscribe.userUnsubscribe);

module.exports = router;
