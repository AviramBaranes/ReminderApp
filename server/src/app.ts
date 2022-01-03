import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import express from 'express';
// import cors from 'cors';
import connectDb from './utils/database';
import { Server } from 'socket.io';
import { createServer } from 'http';

import socket from './utils/socket';

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer,{
    cors:{
        origin:clientOrigin,
        credentials:true,
    }
})

// app.use(cors({origin: clientOrigin}))
const PORT = process.env.PORT || 8080;

connectDb().then(_=>{  
    httpServer.listen(PORT, ()=>{
        console.log(`Reminder App is listening on port ${PORT}`)  
        socket(io)
    })
})