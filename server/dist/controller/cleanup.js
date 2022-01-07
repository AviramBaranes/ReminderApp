"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUp = void 0;
const User_1 = __importDefault(require("../models/User"));
const cleanUp = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const UserReminders = (await User_1.default.findById(userId).populate('reminders.reminderId'));
        if (!UserReminders) {
            res.status(403).send('User not found');
            return;
        }
        const { reminders } = UserReminders;
        const updatedReminder = [];
        reminders.forEach(({ reminderId: reminder }) => {
            if (reminder)
                updatedReminder.push({ reminderId: reminder._id });
        });
        UserReminders.reminders = updatedReminder;
        await UserReminders.save();
        res.status(200).send('Updated user data successfully');
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong, try tp refresh');
        return;
    }
};
exports.cleanUp = cleanUp;
