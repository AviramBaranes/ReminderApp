import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import express from 'express';
import cors from 'cors';

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const app = express();

app.use(cors({origin: clientOrigin}))

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log(`Reminder App is listening on port ${PORT}`))