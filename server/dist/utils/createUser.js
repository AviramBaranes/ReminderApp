"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const Reminders_1 = __importDefault(require("../models/Reminders"));
const createUser = async () => {
    const userReminder = new Reminders_1.default({
        reminders: [],
    });
    await userReminder.save();
    return userReminder;
};
exports.createUser = createUser;
