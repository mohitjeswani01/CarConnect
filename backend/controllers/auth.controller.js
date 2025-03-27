const { validationResult } = require('express-validator');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Extract user data from request body
        const { name, email, password, type, role, address, phone, license } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            type,
            role,
            address,
            phone,
            license
        });

        await user.save();

        // Generate JWT token
        const token = user.getSignedJwtToken();

        // Return user data without password
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            type: user.type,
            role: user.role
        };

        res.status(201).json({
            success: true,
            user: userData,
            token
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = user.getSignedJwtToken();

        // Return user data without password
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            type: user.type,
            role: user.role
        };

        res.status(200).json({
            success: true,
            user: userData,
            token
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current user
// @route   GET /api/auth/current-user
// @access  Private
exports.getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                type: user.type,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};
