"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EVENTS = {
    connection: 'connection',
    CLIENT: {
        USER_CONNECTION: 'USER_CONNECTION',
        NEW_TIMER: 'NEW_TIMER',
        GET_TIMERS: 'GET_TIMERS',
    },
    SERVER: {
        USER_CREATED: 'USER_CREATED',
        NEW_TIMER: 'NEW_TIMER',
        SEND_TIMERS: 'SEND_TIMERS',
        TIMER_DONE: 'TIMER_DONE'
    }
};
function socket(io) {
    io.on(EVENTS.connection, (socket) => {
        console.log('Socket connected');
    });
}
exports.default = socket;
