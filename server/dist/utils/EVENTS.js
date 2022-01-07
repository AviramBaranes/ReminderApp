"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS = void 0;
exports.EVENTS = {
    connection: 'connection',
    CLIENT: {
        NEW_TIMER: 'NEW_TIMER',
        GET_TIMERS: 'GET_TIMERS',
        CHECK_FOR_FINISHED_TIMERS: 'CHECK_FOR_FINISHED_TIMERS',
    },
    SERVER: {
        USER_CREATED: 'USER_CREATED',
        TIMER_CREATED: 'TIMER_CREATED',
        ALL_TIMERS: 'ALL_TIMERS',
        TIMER_DONE: 'TIMER_DONE',
        ERROR: 'ERROR',
    },
};
