import asyncHandler from 'express-async-handler';
import Medicine from '../models/medicineModel.js';
import DoseLog from '../models/doseLogModel.js';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../utils/googleCalendar.js';

// @desc    Get all medicines for logged in user
// @route   GET /api/medicines
// @access  Private
const getMedicines = asyncHandler(async (req, res) => {
    const medicines = await Medicine.find({ user: req.user._id });
    res.json(medicines);
});

// @desc    Get full medicine schedule
// @route   GET /api/medicines/schedule
// @access  Private
const getSchedule = asyncHandler(async (req, res) => {
    const { date, view } = req.query; // date: YYYY-MM-DD, view: 'daily' | 'weekly'
    const targetDate = date ? new Date(date) : new Date();

    // Logic for generating schedule based on medicines and logs
    // precise date handling would be complex, here is a simplified version for "Daily" view

    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const medicines = await Medicine.find({
        user: req.user._id,
        startDate: { $lte: endOfDay },
        $or: [{ endDate: { $exists: false } }, { endDate: { $gte: startOfDay } }],
    });

    const logs = await DoseLog.find({
        user: req.user._id,
        scheduledAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const schedule = [];

    medicines.forEach(med => {
        med.times.forEach(time => {
            const [hours, minutes] = time.split(':');
            const scheduledTime = new Date(startOfDay);
            scheduledTime.setHours(hours, minutes, 0, 0);

            // Find matching log
            const log = logs.find(l =>
                l.medicine.toString() === med._id.toString() &&
                new Date(l.scheduledAt).getTime() === scheduledTime.getTime()
            );

            let status = 'Upcoming';
            if (log) {
                status = log.status; // Taken, Skipped, etc.
            } else if (scheduledTime < new Date()) {
                status = 'Missed';
            }

            schedule.push({
                medicine: med,
                scheduledTime,
                status,
                logId: log ? log._id : null,
            });
        });
    });

    // Sort by time
    schedule.sort((a, b) => a.scheduledTime - b.scheduledTime);

    res.json(schedule);
});

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Private
const getMedicineById = asyncHandler(async (req, res) => {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine && medicine.user.toString() === req.user._id.toString()) {
        res.json(medicine);
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

// @desc    Create a medicine
// @route   POST /api/medicines
// @access  Private
const createMedicine = asyncHandler(async (req, res) => {
    const { name, dosage, frequency, times, startDate, endDate, refillThreshold, currentStock } = req.body;

    const medicine = await Medicine.create({
        user: req.user._id,
        name,
        dosage,
        frequency,
        times,
        startDate,
        endDate,
        refillThreshold,
        currentStock,
    });

    // Create Calendar Event
    try {
        await createCalendarEvent(medicine, req.user);
    } catch (error) {
        console.error('Calendar sync failed:', error);
    }

    res.status(201).json(medicine);
});

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private
const updateMedicine = asyncHandler(async (req, res) => {
    const { name, dosage, frequency, times, startDate, endDate, refillThreshold, currentStock } = req.body;

    const medicine = await Medicine.findById(req.params.id);

    if (medicine && medicine.user.toString() === req.user._id.toString()) {
        medicine.name = name || medicine.name;
        medicine.dosage = dosage || medicine.dosage;
        medicine.frequency = frequency || medicine.frequency;
        medicine.times = times || medicine.times;
        medicine.startDate = startDate || medicine.startDate;
        medicine.endDate = endDate || medicine.endDate;
        medicine.refillThreshold = refillThreshold !== undefined ? refillThreshold : medicine.refillThreshold;
        medicine.currentStock = currentStock !== undefined ? currentStock : medicine.currentStock;

        const updatedMedicine = await medicine.save();

        // Update Calendar - (Simplified for now)
        // updateCalendarEvent(medicine.googleEventId, updatedMedicine);

        res.json(updatedMedicine);
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private
const deleteMedicine = asyncHandler(async (req, res) => {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine && medicine.user.toString() === req.user._id.toString()) {
        await medicine.deleteOne();
        // deleteCalendarEvent(medicine.googleEventId);
        res.json({ message: 'Medicine removed' });
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

export {
    getMedicines,
    getSchedule,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
};
