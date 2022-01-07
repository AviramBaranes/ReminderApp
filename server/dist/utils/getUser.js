"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const createUser_1 = require("./createUser");
const EVENTS_1 = require("./EVENTS");
const getUser = async (userId, io, socket) => {
    let user;
    if (!userId) {
        user = (await (0, createUser_1.createUser)());
        io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.USER_CREATED, {
            userId: user._id,
        });
    }
    else {
        user = await User_1.default.findById(userId);
        if (!user) {
            //not supposed to happen
            io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ERROR, {
                message: 'Something went wrong :( ... please try to refresh',
            });
            return null;
        }
    }
    return user;
};
exports.getUser = getUser;
