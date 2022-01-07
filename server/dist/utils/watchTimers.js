"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReminder = exports.watchTimers = void 0;
const socket_1 = require("../controller/socket");
const Reminders_1 = __importDefault(require("../models/Reminders"));
const User_1 = __importDefault(require("../models/User"));
const timeLeftCalculator_1 = require("./timeLeftCalculator");
const HEADS_UP = 3000;
const watchTimers = async (userId, io, socket) => {
    try {
        const { reminders } = (await User_1.default.findById(userId).populate('reminders.reminderId'));
        reminders.forEach((reminder) => {
            if (reminder.reminderId) {
                (0, exports.checkReminder)(reminder.reminderId, io, socket);
            }
        });
    }
    catch (err) {
        console.log(err);
        io.to(socket.id).emit(socket_1.EVENTS.SERVER.ERROR, {
            message: "Couldn't find reminder",
        });
    }
};
exports.watchTimers = watchTimers;
//exporting for new timers.
//(watchTimers will be called when client open, after that in order for watch new timers checkReminder will be called)
const checkReminder = async (reminder, io, socket) => {
    const timeOut = (0, timeLeftCalculator_1.getTimeLeft)(reminder);
    if (timeOut < 0) {
        io.to(socket.id).emit(socket_1.EVENTS.SERVER.TIMER_DONE, {
            name: reminder.name,
            done: true,
        });
        await deleteReminder(reminder._id);
    }
    else {
        const setTimeoutPointer = setTimeout(() => {
            io.to(socket.id).emit(socket_1.EVENTS.SERVER.TIMER_DONE, {
                timeLeft: HEADS_UP,
                name: reminder.name,
                done: false,
            });
            setTimeout(async () => {
                await deleteReminder(reminder._id);
            }, HEADS_UP);
        }, timeOut - HEADS_UP);
        socket.on('disconnected', () => clearTimeout(setTimeoutPointer));
    }
};
exports.checkReminder = checkReminder;
async function deleteReminder(reminderId) {
    try {
        await Reminders_1.default.findByIdAndDelete(reminderId);
        // const { reminders } = remindersModel;
        // const updatedReminders = reminders.filter(
        //   (r) => r._id!.toString() !== reminderId.toString()
        // );
        // remindersModel.reminders = updatedReminders;
        // await remindersModel.save();
    }
    catch (err) {
        console.log(err);
    }
}
