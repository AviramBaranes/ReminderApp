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
exports.getUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const createUser_1 = require("./createUser");
const EVENTS_1 = require("./EVENTS");
const getUser = (userId, io, socket) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    if (!userId) {
        user = (yield (0, createUser_1.createUser)());
        io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.USER_CREATED, {
            userId: user._id,
        });
    }
    else {
        user = yield User_1.default.findById(userId);
        if (!user) {
            //not supposed to happen
            io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ERROR, {
                message: 'Something went wrong :( ... please try to refresh',
            });
            return null;
        }
    }
    return user;
});
exports.getUser = getUser;
