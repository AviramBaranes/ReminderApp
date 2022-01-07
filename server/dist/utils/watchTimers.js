"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchTimers = void 0;
const socket_1 = require("../controller/socket");
const Reminders_1 = __importDefault(require("../models/Reminders"));
const User_1 = __importDefault(require("../models/User"));
const timeLeftCalculator_1 = require("./timeLeftCalculator");
const HEADS_UP = 3000;
const watchTimers = async (userId, io, socket, timeOutPointersList) => {
    try {
        const { reminders } = (await User_1.default.findById(userId).populate('reminders.reminderId'));
        reminders.forEach(({ reminderId: reminder }) => {
            if (reminder) {
                console.log(reminder);
                const timeOut = (0, timeLeftCalculator_1.getTimeLeft)(reminder);
                console.log(2);
                if (timeOut < 0) {
                    io.to(socket.id).emit(socket_1.EVENTS.SERVER.TIMER_DONE, {
                        name: reminder.name,
                        done: true,
                    });
                    deleteReminder(reminder._id);
                }
                else {
                    let secondTimeOutPointer = null;
                    const firstTimeoutPointer = setTimeout(() => {
                        io.to(socket.id).emit(socket_1.EVENTS.SERVER.TIMER_DONE, {
                            timeLeft: HEADS_UP,
                            name: reminder.name,
                            done: false,
                        });
                        secondTimeOutPointer = setTimeout(async () => {
                            await deleteReminder(reminder._id);
                        }, HEADS_UP);
                    }, timeOut - HEADS_UP);
                    timeOutPointersList.push({
                        secondTimeOutPointer,
                        firstTimeoutPointer,
                    });
                }
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
async function deleteReminder(reminderId) {
    try {
        console.table({ reminderId });
        await Reminders_1.default.findByIdAndDelete(reminderId);
    }
    catch (err) {
        console.log(err);
    }
}
