"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS = void 0;
const Reminders_1 = __importDefault(require("../models/Reminders"));
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
        NEW_TIMER: 'NEW_TIMER',
        ALL_TIMERS: 'ALL_TIMERS',
        TIMER_DONE: 'TIMER_DONE',
        ERROR: 'ERROR',
    },
};
function socket(io) {
    io.on(exports.EVENTS.connection, async (socket) => {
        console.log('Socket connected');
        socket.on(exports.EVENTS.CLIENT.CHECK_FOR_FINISHED_TIMERS, async ({ userId }) => {
            if (!userId) {
                io.to(socket.id).emit(exports.EVENTS.SERVER.ERROR, {
                    message: 'something went wrong :(',
                });
                return;
            }
            await (0, watchTimers_1.watchTimers)(userId, io, socket.id);
        });
        socket.on(exports.EVENTS.CLIENT.NEW_TIMER, async ({ userId, name, time, date, description }) => {
            try {
                let userReminders;
                if (!userId) {
                    userReminders = await (0, createUser_1.createUser)();
                    io.to(socket.id).emit(exports.EVENTS.SERVER.USER_CREATED, {
                        userId: userReminders._id,
                    });
                }
                else {
                    userReminders = (await Reminders_1.default.findById(userId));
                    if (!userReminders) {
                        io.to(socket.id).emit(exports.EVENTS.SERVER.ERROR, {
                            message: "Couldn't find any reminders",
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
                const newReminder = {
                    name,
                    time,
                    dateStarted: new Date(date),
                };
                if (description)
                    newReminder.description = description;
                userReminders.reminders.push(newReminder);
                await userReminders.save();
                io.to(socket.id).emit(exports.EVENTS.SERVER.NEW_TIMER);
                (0, watchTimers_1.checkReminder)(newReminder, io, socket.id, userReminders);
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
                const { reminders } = (await Reminders_1.default.findById(userId));
                console.log(reminders);
                const calculatedReminders = reminders.map((reminder) => {
                    const timeLeft = (0, timeLeftCalculator_1.getTimeLeft)(reminder);
                    const calculatedReminder = {
                        name: reminder.name,
                        timeLeft,
                    };
                    if (reminder.description)
                        calculatedReminder.description = reminder.description;
                    return calculatedReminder;
                });
                console.log({ calculatedReminders });
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
