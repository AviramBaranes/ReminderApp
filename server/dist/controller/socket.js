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
Object.defineProperty(exports, "__esModule", { value: true });
const clearTimeouts_1 = require("../utils/clearTimeouts");
const createReminder_1 = require("../utils/createReminder");
const EVENTS_1 = require("../utils/EVENTS");
const getTimers_1 = require("../utils/getTimers");
const getUser_1 = require("../utils/getUser");
const validateTimer_1 = require("../utils/validateTimer");
const watchTimers_1 = require("../utils/watchTimers");
function socket(io) {
    io.on(EVENTS_1.EVENTS.connection, (socket) => __awaiter(this, void 0, void 0, function* () {
        console.log('Socket connected');
        const timeOutPointersList = [];
        socket.on('disconnect', () => {
            (0, clearTimeouts_1.clearGlobalTimeouts)(timeOutPointersList);
        });
        socket.on(EVENTS_1.EVENTS.CLIENT.CHECK_FOR_FINISHED_TIMERS, ({ userId }) => __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ERROR, {
                    message: 'something went wrong :(',
                });
                return;
            }
            yield (0, watchTimers_1.watchTimers)(userId, io, socket, timeOutPointersList);
        }));
        let latest_NEW_TIMER_Call; //for rate limits
        socket.on(EVENTS_1.EVENTS.CLIENT.NEW_TIMER, ({ userId, name, time, timeStarted, description }) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (latest_NEW_TIMER_Call &&
                    Date.now() - latest_NEW_TIMER_Call < 2000) {
                    io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ERROR, {
                        message: 'You need to wait at least 2 seconds between each timer creation',
                    });
                    return;
                }
                const user = yield (0, getUser_1.getUser)(userId, io, socket);
                if (!user)
                    return;
                if (!(0, validateTimer_1.isTimeValid)(name, time, io, socket))
                    return;
                yield (0, createReminder_1.createReminder)(user._id, name, time, timeStarted, description, user);
                io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.TIMER_CREATED);
                (0, clearTimeouts_1.clearGlobalTimeouts)(timeOutPointersList); //if not clearing the timeout some reminders will be sent more than once
                yield (0, watchTimers_1.watchTimers)(user._id, io, socket, timeOutPointersList);
                latest_NEW_TIMER_Call = Date.now();
            }
            catch (err) {
                io.to(socket.id).emit(EVENTS_1.EVENTS.SERVER.ERROR, {
                    message: 'something went wrong :(',
                });
            }
        }));
        socket.on(EVENTS_1.EVENTS.CLIENT.GET_TIMERS, ({ userId }) => __awaiter(this, void 0, void 0, function* () { return (0, getTimers_1.getTimers)(userId, io, socket); }));
    }));
}
exports.default = socket;
