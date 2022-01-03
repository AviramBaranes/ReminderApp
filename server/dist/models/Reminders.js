"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const RemindersSchema = new Schema({
    reminders: [
        {
            name: { type: String, required: true },
            description: { type: String, required: false },
            dateStarted: { type: Date, required: true },
            time: { type: Number, required: true },
        },
    ],
});
const Reminders = mongoose_1.default.model('Reminders', RemindersSchema);
exports.default = Reminders;
