"use strict";
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
// import { cleanUp } from './controller/cleanUp';
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: clientOrigin, credentials: true }));
// app.put('/cleanup', cleanUp);
app.get('/', (req, res) => {
    res.send('Server is on');
});
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
