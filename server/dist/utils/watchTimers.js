"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReminder = exports.watchTimers = void 0;
const socket_1 = require("../controller/socket");
const Reminders_1 = __importDefault(require("../models/Reminders"));
const timeLeftCalculator_1 = require("./timeLeftCalculator");
const watchTimers = async (userId, io, socketId) => {
    const remindersModel = (await Reminders_1.default.findById(userId));
    remindersModel.reminders.forEach((reminder) => (0, exports.checkReminder)(reminder, io, socketId, remindersModel));
};
exports.watchTimers = watchTimers;
//exporting for new timers.
//(watchTimers will be called when client open, after that in order for watch new timers checkReminder will be called)
const checkReminder = (reminder, io, socketId, reminders) => {
    const timeOut = (0, timeLeftCalculator_1.getTimeLeft)(reminder);
    console.log(timeOut);
    if (timeOut < 0) {
        io.to(socketId).emit(socket_1.EVENTS.SERVER.TIMER_DONE, {
            name: reminder.name,
            done: true,
        });
    }
    else {
        setTimeout(() => {
            console.log('done');
            io.to(socketId).emit(socket_1.EVENTS.SERVER.TIMER_DONE, {
                name: reminder.name,
                done: false,
            });
        }, timeOut - 10000);
    }
    deleteReminder(reminder._id, reminders);
};
exports.checkReminder = checkReminder;
async function deleteReminder(reminderId, remindersModel) {
    try {
        const { reminders } = remindersModel;
        const currentReminderIndex = reminders.findIndex((r) => r._id === reminderId);
        reminders.splice(currentReminderIndex, 1);
        await remindersModel.save();
    }
    catch (err) {
        console.log(err);
    }
}
