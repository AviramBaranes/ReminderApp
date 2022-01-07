"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    reminders: [
        {
            reminderId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Reminders',
            },
        },
    ],
});
const Users = mongoose_1.default.model('Users', UserSchema);
exports.default = Users;
