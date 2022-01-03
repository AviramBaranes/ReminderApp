import { Server, Socket } from 'socket.io';
import Reminders, { Reminder, RemindersType } from '../models/Reminders';
import { createUser } from './createUser';

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    NEW_TIMER: 'NEW_TIMER',
    GET_TIMERS: 'GET_TIMERS',
  },
  SERVER: {
    USER_CREATED: 'USER_CREATED',
    NEW_TIMER: 'NEW_TIMER',
    SEND_TIMERS: 'SEND_TIMERS',
    TIMER_DONE: 'TIMER_DONE',
    ERROR: 'ERROR',
  },
};

function socket(io: Server) {
  io.on(EVENTS.connection, async (socket: Socket) => {
    console.log('Socket connected');

    socket.on(
      EVENTS.CLIENT.NEW_TIMER,
      async ({ userId, name, time, date, description }) => {
        let userReminders: RemindersType;
        if (!userId) {
          userReminders = await createUser();
          socket.emit(EVENTS.SERVER.USER_CREATED, {
            userId: userReminders._id,
          });
        } else {
          userReminders = (await Reminders.findById(userId)) as RemindersType;

          if (!userReminders) {
            socket.emit(EVENTS.SERVER.ERROR, {
              message: "Couldn't find any reminders",
            });
            return;
          }
        }

        if (name.length < 2) {
          socket.emit(EVENTS.SERVER.ERROR, {
            message: "Reminder's name is too short",
          });
          return;
        }
        if (name.length > 15) {
          socket.emit(EVENTS.SERVER.ERROR, {
            message: "Reminder's name is too long",
          });
          return;
        }
        if (time > 86_400) {
          socket.emit(EVENTS.SERVER.ERROR, { message: 'Timer is too long' });
          return;
        }

        const newReminder: Reminder = {
          name,
          time,
          dateStarted: new Date(date),
        };

        if (description) newReminder.description = description;

        userReminders.reminders.push(newReminder);
        await userReminders.save();

        socket.emit(EVENTS.SERVER.NEW_TIMER);
      }
    );
  });
}

export default socket;
// type On = {
//     (event:'NEW_TIMER',f:({userId,name,date,description}:{userId?:string,name:string,date:string,description?:string})=>void ):void;
//     (event:'GET_TIMERS',f:()=>void ):void;
// }

// interface Socket{
//     on:On;

// }
