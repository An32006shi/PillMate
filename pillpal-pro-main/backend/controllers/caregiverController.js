
import asyncHandler from 'express-async-handler';
import Caregiver from '../models/caregiverModel.js';

// @desc    Get all caregivers
// @route   GET /api/caregivers
// @access  Private
const getCaregivers = asyncHandler(async (req, res) => {
    const caregivers = await Caregiver.find({ user: req.user._id });
    res.json(caregivers);
});

// @desc    Add caregiver
// @route   POST /api/caregivers
// @access  Private
const addCaregiver = asyncHandler(async (req, res) => {
    const { name, email, phone, relationship } = req.body;

    const caregiver = await Caregiver.create({
        user: req.user._id,
        name,
        email,
        phone,
        relationship,
    });

    res.status(201).json(caregiver);
});

// @desc    Delete caregiver
// @route   DELETE /api/caregivers/:id
// @access  Private
const deleteCaregiver = asyncHandler(async (req, res) => {
    const caregiver = await Caregiver.findById(req.params.id);

    if (caregiver && caregiver.user.toString() === req.user._id.toString()) {
        await caregiver.deleteOne();
        res.json({ message: 'Caregiver removed' });
    } else {
        res.status(404);
        throw new Error('Caregiver not found');
    }
});

export { getCaregivers, addCaregiver, deleteCaregiver };
