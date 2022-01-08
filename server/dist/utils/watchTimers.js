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
exports.watchTimers = void 0;
const Reminders_1 = __importDefault(require("../models/Reminders"));
const User_1 = __importDefault(require("../models/User"));
const EVENTS_1 = require("./EVENTS");
const timeLeftCalculator_1 = require("./timeLeftCalculator");
const HEADS_UP = 3000;
const watchTimers = (userId, io, socket, timeOutPointersList) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reminders } = (yield User_1.default.findById(userId).populate('reminders.reminderId'));
        reminders.forEach(({ reminderId: reminder }) => {
            if (reminder) {
                const timeOut = (0, timeLeftCalculator_1.getTimeLeft)(reminder);
                if (timeOut < 0) {
                    io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.TIMER_DONE, {
                        name: reminder.name,
                        done: true,
                    });
                    deleteReminder(reminder._id);
                }
                else {
                    let secondTimeOutPointer = null;
                    const timeLeft = HEADS_UP > timeOut ? timeOut : HEADS_UP; //default is 3 if smaller than the current time left
                    const timeForFirstTimeOut = HEADS_UP > timeOut ? timeOut : timeOut - HEADS_UP; //same but 3 seconds before
                    const firstTimeoutPointer = setTimeout(() => {
                        io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.TIMER_DONE, {
                            timeLeft,
                            name: reminder.name,
                            done: false,
                        });
                        secondTimeOutPointer = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                            yield deleteReminder(reminder._id);
                        }), HEADS_UP);
                    }, timeForFirstTimeOut);
                    timeOutPointersList.push({
                        secondTimeOutPointer,
                        firstTimeoutPointer,
                    });
                }
            }
        });
    }
    catch (err) {
        io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ERROR, {
            message: "Couldn't find reminder",
        });
    }
});
exports.watchTimers = watchTimers;
function deleteReminder(reminderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Reminders_1.default.findByIdAndDelete(reminderId);
        }
        catch (err) {
            console.log(err);
        }
    });
}
