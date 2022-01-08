import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import express from 'express';
import connectDb from './utils/database';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

import socket from './controller/socket';
import Users, { User } from './models/User';
import { ObjectId } from 'mongoose';
import { Reminder } from './models/Reminders';
// import { cleanUp } from './controller/cleanUp';

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const app = express();

app.use(express.json());

app.use(cors({ origin: clientOrigin, credentials: true }));

app.put('/cleanup', async (req, res, next) => {
  try {
    const { userId } = req.body;

    const UserReminders = (await Users.findById(userId).populate(
      'reminders.reminderId'
    )) as User<ObjectId | Reminder>;

    if (!UserReminders) {
      res.status(403).send('User not found');
      return;
    }

    const { reminders } = UserReminders as User<Reminder>;

    const updatedReminder: { reminderId: ObjectId }[] = [];

    reminders.forEach(({ reminderId: reminder }: { reminderId: Reminder }) => {
      if (reminder) updatedReminder.push({ reminderId: reminder._id });
    });

    (UserReminders as User<ObjectId>).reminders = updatedReminder;
    await UserReminders.save();

    res.status(200).send('Updated user data successfully');
  } catch (err) {
    res.status(500).send('Something went wrong, try tp refresh');
    return;
  }
});

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
