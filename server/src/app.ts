import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import express from 'express';
import connectDb from './utils/database';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

import socket from './controller/socket';
// import { cleanUp } from './controller/cleanUp';

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const app = express();

app.use(express.json());

app.use(cors({ origin: clientOrigin, credentials: true }));

// app.put('/cleanup', cleanUp);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: clientOrigin,
    credentials: true,
  },
});

const PORT = process.env.PORT || 8082;

connectDb().then((_) => {
  httpServer.listen(PORT, () => {
    console.log(`Reminder App is listening on port ${PORT}`);
    socket(io);
  });
});
