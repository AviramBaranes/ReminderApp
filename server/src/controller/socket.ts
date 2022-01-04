import { Server, Socket } from 'socket.io';
import Reminders, { Reminder, RemindersType } from '../models/Reminders';

import { createUser } from '../utils/createUser';
import { getTimeLeft } from '../utils/timeLeftCalculator';
import { checkReminder, watchTimers } from '../utils/watchTimers';

export const EVENTS = {
  connection: 'connection',
  CLIENT: {
    NEW_TIMER: 'NEW_TIMER',
    GET_TIMERS: 'GET_TIMERS',
    CHECK_FOR_FINISHED_TIMERS: 'CHECK_FOR_FINISHED_TIMERS',
  },
  SERVER: {
    USER_CREATED: 'USER_CREATED',
    NEW_TIMER: 'NEW_TIMER',
    ALL_TIMERS: 'ALL_TIMERS',
    TIMER_DONE: 'TIMER_DONE',
    ERROR: 'ERROR',
  },
};

function socket(io: Server) {
  io.on(EVENTS.connection, async (socket: Socket) => {
    console.log('Socket connected');

    socket.on(EVENTS.CLIENT.CHECK_FOR_FINISHED_TIMERS, async ({ userId }) => {
      if (!userId) {
        io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
          message: 'something went wrong :(',
        });
        return;
      }

      await watchTimers(userId, io, socket.id);
    });

    socket.on(
      EVENTS.CLIENT.NEW_TIMER,
      async ({ userId, name, time, date, description }) => {
        try {
          let userReminders: RemindersType;
          if (!userId) {
            userReminders = await createUser();
            io.to(socket.id).emit(EVENTS.SERVER.USER_CREATED, {
              userId: userReminders._id,
            });
          } else {
            userReminders = (await Reminders.findById(userId)) as RemindersType;

            if (!userReminders) {
              io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
                message: "Couldn't find any reminders",
              });
              return;
            }
          }

          if (name.length < 2) {
            io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
              message: "Reminder's name is too short",
            });
            return;
          }
          if (name.length > 15) {
            io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
              message: "Reminder's name is too long",
            });
            return;
          }
          if (time > 86_400) {
            io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
              message: 'Timer is too long',
            });
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

          io.to(socket.id).emit(EVENTS.SERVER.NEW_TIMER);
          checkReminder(newReminder, io, socket.id, userReminders);
        } catch (err) {
          console.log(err);
          io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
            message: 'something went wrong :(',
          });
        }
      }
    );

    socket.on(EVENTS.CLIENT.GET_TIMERS, async ({ userId }) => {
      try {
        const { reminders } = (await Reminders.findById(
          userId
        )) as RemindersType;

        const calculatedReminders = reminders.map((reminder) => {
          const timeLeft = getTimeLeft(reminder);

          const calculatedReminder = {
            name: reminder.name,
            timeLeft,
          } as {
            name: string;
            timeLeft: number;
            description?: string;
          };

          if (reminder.description)
            calculatedReminder.description = reminder.description;

          return calculatedReminder;
        });

        io.to(socket.id).emit(EVENTS.CLIENT.GET_TIMERS, {
          calculatedReminders,
        });
      } catch (err) {
        console.log(err);
        io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
          message: 'Something went wrong',
        });
      }
    });
  });
}

export default socket;
