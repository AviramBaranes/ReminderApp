"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReminder = void 0;
const Reminders_1 = __importDefault(require("../models/Reminders"));
const createReminder = async (userId, name, time, timeStarted, description, user) => {
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
};
exports.createReminder = createReminder;
