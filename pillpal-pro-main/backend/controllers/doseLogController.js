
import asyncHandler from 'express-async-handler';
import DoseLog from '../models/doseLogModel.js';

// @desc    Log a dose (Taken/Missed/Skipped)
// @route   POST /api/logs
// @access  Private
const createDoseLog = asyncHandler(async (req, res) => {
    const { medicine, scheduledAt, takenAt, status, symptoms, sideEffects, notes } = req.body;

    const log = await DoseLog.create({
        user: req.user._id,
        medicine,
        scheduledAt,
        takenAt,
        status,
        symptoms,
        sideEffects,
        notes,
    });

    res.status(201).json(log);
});

// @desc    Get all logs for user
// @route   GET /api/logs
// @access  Private
const getDoseLogs = asyncHandler(async (req, res) => {
    const logs = await DoseLog.find({ user: req.user._id }).populate('medicine', 'name dosage');
    res.json(logs);
});

// @desc    Get logs for specific medicine
// @route   GET /api/logs/:medicineId
// @access  Private
const getDoseLogsByMedicine = asyncHandler(async (req, res) => {
    const logs = await DoseLog.find({ user: req.user._id, medicine: req.params.medicineId });
    res.json(logs);
});

export { createDoseLog, getDoseLogs, getDoseLogsByMedicine };
