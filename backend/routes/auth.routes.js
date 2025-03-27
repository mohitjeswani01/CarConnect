const express = require('express');
const { body } = require('express-validator');
const { register, login, getCurrentUser } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validate registration input
const validateRegister = [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('type', 'Type must be either carRental or carpool').isIn(['carRental', 'carpool']),
    body('role', 'Role is required').not().isEmpty()
];

// Validate login input
const validateLogin = [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
];

// Routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/current-user', protect, getCurrentUser);

module.exports = router;