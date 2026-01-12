import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { getGreeting } from '../utils/greeting.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Send Login Email
        if (process.env.EMAIL_USER) {
            const time = new Date().toLocaleTimeString('en-US', { timeZone: user.timezone || 'UTC' });
            sendEmail({
                email: user.email,
                subject: 'Login Notification - PillMate',
                message: `Hi ${user.name}, you have successfully logged in at ${time}.`,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            timezone: user.timezone,
            preferences: user.preferences,
            token: generateToken(user._id),
            greeting: `${getGreeting(user.timezone)} ${user.name}`,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, timezone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        timezone: timezone || 'UTC',
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            timezone: user.timezone,
            preferences: user.preferences,
            token: generateToken(user._id),
            greeting: `${getGreeting(user.timezone)} ${user.name}`,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            timezone: user.timezone,
            preferences: user.preferences,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.timezone = req.body.timezone || user.timezone;

        if (req.body.password) {
            user.password = req.body.password;
        }

        // Update preferences
        if (req.body.preferences) {
            user.preferences = {
                ...user.preferences,
                ...req.body.preferences
            };
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            timezone: updatedUser.timezone,
            preferences: updatedUser.preferences,
            token: generateToken(updatedUser._id),
            greeting: `${getGreeting(updatedUser.timezone)} ${updatedUser.name}`,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { authUser, registerUser, getUserProfile, updateUserProfile };
