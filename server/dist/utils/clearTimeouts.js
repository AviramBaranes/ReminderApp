"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearGlobalTimeouts = void 0;
const clearGlobalTimeouts = (timeOutPointersList) => {
    timeOutPointersList.forEach(({ firstTimeoutPointer, secondTimeOutPointer }) => {
        clearTimeout(firstTimeoutPointer);
        secondTimeOutPointer && clearTimeout(secondTimeOutPointer);
    });
    timeOutPointersList.length = 0;
};
exports.clearGlobalTimeouts = clearGlobalTimeouts;
