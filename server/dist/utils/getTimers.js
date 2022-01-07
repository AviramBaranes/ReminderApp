"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimers = void 0;
const User_1 = __importDefault(require("../models/User"));
const EVENTS_1 = require("./EVENTS");
const timeLeftCalculator_1 = require("./timeLeftCalculator");
const getTimers = async (userId, io, socket) => {
    try {
        const { reminders } = await User_1.default.findById(userId).populate('reminders.reminderId');
        const calculatedReminders = [];
        reminders.forEach(({ reminderId: reminder }) => {
            if (reminder) {
                const timeLeft = (0, timeLeftCalculator_1.getTimeLeft)(reminder);
                const calculatedReminder = {
                    name: reminder.name,
                    timeLeft,
                    totalTime: reminder.time,
                };
                if (reminder.description)
                    calculatedReminder.description = reminder.description;
                calculatedReminders.push(calculatedReminder);
            }
        });
        io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ALL_TIMERS, {
            calculatedReminders,
        });
    }
    catch (err) {
        console.log(err);
        io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ERROR, {
            message: 'Something went wrong',
        });
    }
};
exports.getTimers = getTimers;
