const express = require('express');
const multer = require('multer');
const {
    getCarListings,
    addCar,
    getCar,
    updateCar,
    deleteCar,
    toggleCarAvailability,
    getRentalRecords
} = require('../controllers/carOwner.controller');
const { protect, authorize, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/cars');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Protect all routes
router.use(protect);
router.use(authorize('carRental'));
router.use(authorizeRole('owner'));

// Routes
router.get('/listings', getCarListings);
router.post('/cars', upload.array('photos', 5), addCar);
router.get('/cars/:id', getCar);
router.put('/cars/:id', upload.array('photos', 5), updateCar);
router.delete('/cars/:id', deleteCar);
router.patch('/cars/:id/toggle-availability', toggleCarAvailability);
router.get('/rental-records', getRentalRecords);

module.exports = router;