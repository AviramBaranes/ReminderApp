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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./utils/database"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const socket_1 = __importDefault(require("./controller/socket"));
const User_1 = __importDefault(require("./models/User"));
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: clientOrigin, credentials: true }));
app.put('/cleanup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const UserReminders = (yield User_1.default.findById(userId).populate('reminders.reminderId'));
        if (!UserReminders) {
            res.status(403).send('User not found');
            return;
        }
        const { reminders } = UserReminders;
        const updatedReminder = [];
        reminders.forEach(({ reminderId: reminder }) => {
            if (reminder)
                updatedReminder.push({ reminderId: reminder._id });
        });
        UserReminders.reminders = updatedReminder;
        yield UserReminders.save();
        res.status(200).send('Updated user data successfully');
    }
    catch (err) {
        res.status(500).send('Something went wrong, try tp refresh');
        return;
    }
}));
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: clientOrigin,
        credentials: true,
    },
});
const PORT = process.env.PORT || 8082;
(0, database_1.default)().then((_) => {
    httpServer.listen(PORT, () => {
        console.log(`Reminder App is listening on port ${PORT}`);
        (0, socket_1.default)(io);
    });
});
