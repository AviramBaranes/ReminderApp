"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReminder = exports.watchTimers = void 0;
const socket_1 = require("../controller/socket");
const Reminders_1 = __importDefault(require("../models/Reminders"));
const timeLeftCalculator_1 = require("./timeLeftCalculator");
const HEADS_UP = 10000;
const watchTimers = async (userId, io, socket) => {
    const remindersModel = (await Reminders_1.default.findById(userId));
    remindersModel.reminders.forEach((reminder) => (0, exports.checkReminder)(reminder, io, socket, remindersModel));
};
exports.watchTimers = watchTimers;
//exporting for new timers.
//(watchTimers will be called when client open, after that in order for watch new timers checkReminder will be called)
const checkReminder = (reminder, io, socket, reminders) => {
    const timeOut = (0, timeLeftCalculator_1.getTimeLeft)(reminder);
    if (timeOut < 0) {
        io.to(socket.id).emit(socket_1.EVENTS.SERVER.TIMER_DONE, {
            name: reminder.name,
            done: true,
        });
        deleteReminder(reminder._id, reminders);
    }
    else {
        const timeout = setTimeout(() => {
            io.to(socket.id).emit(socket_1.EVENTS.SERVER.TIMER_DONE, {
                timeLeft: HEADS_UP,
                name: reminder.name,
                done: false,
            });
            deleteReminder(reminder._id, reminders);
        }, timeOut - HEADS_UP);
        socket.on('disconnected', () => clearTimeout(timeout));
    }
};
exports.checkReminder = checkReminder;
async function deleteReminder(reminderId, remindersModel) {
    try {
        const { reminders } = remindersModel;
        const updatedReminders = reminders.filter((r) => r._id.toString() !== reminderId.toString());
        remindersModel.reminders = updatedReminders;
        await remindersModel.save();
    }
    catch (err) {
        console.log(err);
    }
}
