"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimers = void 0;
const User_1 = __importDefault(require("../models/User"));
const EVENTS_1 = require("./EVENTS");
const timeLeftCalculator_1 = require("./timeLeftCalculator");
const getTimers = (userId, io, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reminders } = yield User_1.default.findById(userId).populate('reminders.reminderId');
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
        io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ERROR, {
            message: 'Something went wrong',
        });
    }
});
exports.getTimers = getTimers;
