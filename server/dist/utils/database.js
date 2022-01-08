"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDb() {
    const uri = process.env.MONGO_URI ||
        'mongodb+srv://Hlife11:hlifeJJ003nz@hlife.pzl2m.mongodb.net/reminderApp?retryWrites=true&w=majority';
    try {
        await mongoose_1.default.connect(uri);
        console.log('MongoDB connected');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
exports.default = connectDb;
