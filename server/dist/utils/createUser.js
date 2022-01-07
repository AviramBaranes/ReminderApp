"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const createUser = async () => {
    const userReminder = new User_1.default({
        reminders: [],
    });
    const newUser = await userReminder.save();
    return newUser;
};
exports.createUser = createUser;
