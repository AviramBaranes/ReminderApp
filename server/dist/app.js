"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: clientOrigin }));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Reminder App is listening on port ${PORT}`));
