"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTimeValid = void 0;
const EVENTS_1 = require("./EVENTS");
const isTimeValid = (name, time, io, socket) => {
    if (name.length < 2) {
        io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ERROR, {
            message: "Reminder's name is too short",
        });
        return false;
    }
    if (name.length > 15) {
        io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ERROR, {
            message: "Reminder's name is too long",
        });
        return false;
    }
    if (time > 86400) {
        io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ERROR, {
            message: 'Timer is too long',
        });
        return false;
    }
    return true;
};
exports.isTimeValid = isTimeValid;
