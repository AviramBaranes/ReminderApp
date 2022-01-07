"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeLeft = void 0;
const getTimeLeft = (reminder) => {
    const startTime = reminder.timeStarted;
    const reminderTime = reminder.time * 1000;
    const endTime = startTime + reminderTime;
    const currentTime = Date.now();
    return endTime - currentTime;
};
exports.getTimeLeft = getTimeLeft;
