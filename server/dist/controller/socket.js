"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS = void 0;
const Reminders_1 = __importDefault(require("../models/Reminders"));
const User_1 = __importDefault(require("../models/User"));
const clearTimeouts_1 = require("../utils/clearTimeouts");
const createUser_1 = require("../utils/createUser");
const timeLeftCalculator_1 = require("../utils/timeLeftCalculator");
const watchTimers_1 = require("../utils/watchTimers");
exports.EVENTS = {
    connection: 'connection',
    CLIENT: {
        NEW_TIMER: 'NEW_TIMER',
        GET_TIMERS: 'GET_TIMERS',
        CHECK_FOR_FINISHED_TIMERS: 'CHECK_FOR_FINISHED_TIMERS',
    },
    SERVER: {
        USER_CREATED: 'USER_CREATED',
        TIMER_CREATED: 'TIMER_CREATED',
        ALL_TIMERS: 'ALL_TIMERS',
        TIMER_DONE: 'TIMER_DONE',
        ERROR: 'ERROR',
    },
};
function socket(io) {
    io.on(exports.EVENTS.connection, async (socket) => {
        console.log('Socket connected');
        const timeOutPointersList = [];
        socket.on('disconnect', () => {
            (0, clearTimeouts_1.clearGlobalTimeouts)(timeOutPointersList);
        });
        socket.on(exports.EVENTS.CLIENT.CHECK_FOR_FINISHED_TIMERS, async ({ userId }) => {
            if (!userId) {
                io.to(socket.id).emit(exports.EVENTS.SERVER.ERROR, {
                    message: 'something went wrong :(',
                });
                return;
            }
            await (0, watchTimers_1.watchTimers)(userId, io, socket, timeOutPointersList);
        });
        socket.on(exports.EVENTS.CLIENT.NEW_TIMER, async ({ userId, name, time, timeStarted, description }) => {
            try {
                let user;
                if (!userId) {
                    user = await (0, createUser_1.createUser)();
                    io.to(socket.id).emit(exports.EVENTS.SERVER.USER_CREATED, {
                        userId: user._id,
                    });
                }
                else {
                    user = (await User_1.default.findById(userId));
                    if (!user) {
                        io.to(socket.id).emit(exports.EVENTS.SERVER.ERROR, {
                            message: 'Something went wrong :(, please try to refresh',
                        });
                        return;
                    }
                }
                if (name.length < 2) {
                    io.to(socket.id).emit(exports.EVENTS.SERVER.ERROR, {
                        message: "Reminder's name is too short",
                    });
                    return;
                }
                if (name.length > 15) {
                    io.to(socket.id).emit(exports.EVENTS.SERVER.ERROR, {
                        message: "Reminder's name is too long",
                    });
                    return;
                }
                if (time > 86400) {
                    io.to(socket.id).emit(exports.EVENTS.SERVER.ERROR, {
                        message: 'Timer is too long',
                    });
                    return;
                }
                const reminder = {
                    userId,
                    name,
                    time,
                    timeStarted,
                };
                if (description)
                    reminder.description = description;
                const newReminder = (await new Reminders_1.default(reminder));
                const savedReminder = await newReminder.save();
                user.reminders.push({ reminderId: savedReminder._id });
                await user.save();
                io.to(socket.id).emit(exports.EVENTS.SERVER.TIMER_CREATED);
                //if not clearing the timeout some reminders will be sent more than once
                (0, clearTimeouts_1.clearGlobalTimeouts)(timeOutPointersList);
                await (0, watchTimers_1.watchTimers)(userId, io, socket, timeOutPointersList);
            }
            catch (err) {
                console.log(err);
                io.to(socket.id).emit(exports.EVENTS.SERVER.ERROR, {
                    message: 'something went wrong :(',
                });
            }
        });
        socket.on(exports.EVENTS.CLIENT.GET_TIMERS, async ({ userId }) => {
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
                io.to(socket.id).emit(exports.EVENTS.SERVER.ALL_TIMERS, {
                    calculatedReminders,
                });
            }
            catch (err) {
                console.log(err);
                io.to(socket.id).emit(exports.EVENTS.SERVER.ERROR, {
                    message: 'Something went wrong',
                });
            }
        });
    });
}
exports.default = socket;
