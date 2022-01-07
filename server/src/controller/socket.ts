import { Server, Socket } from 'socket.io';
import Reminders, { Reminder } from '../models/Reminders';
import Users, { User } from '../models/User';

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
    TIMER_CREATED: 'TIMER_CREATED',
    ALL_TIMERS: 'ALL_TIMERS',
    TIMER_DONE: 'TIMER_DONE',
    ERROR: 'ERROR',
  },
};

interface CalculatedReminder {
  name: string;
  timeLeft: number;
  totalTime: number;
  description?: string;
}
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

      await watchTimers(userId, io, socket);
    });

    socket.on(
      EVENTS.CLIENT.NEW_TIMER,
      async ({ userId, name, time, timeStarted, description }) => {
        try {
          let user: any;
          if (!userId) {
            user = await createUser();
            io.to(socket.id).emit(EVENTS.SERVER.USER_CREATED, {
              userId: user._id,
            });
          } else {
            user = (await Users.findById(userId)) as User;

            if (!user) {
              io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
                message: 'Something went wrong :(, please try to refresh',
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

          const reminder: {
            userId: string;
            name: string;
            time: number;
            timeStarted: number;
            description?: string;
          } = {
            userId,
            name,
            time,
            timeStarted,
          };

          if (description) reminder.description = description;

          const newReminder = (await new Reminders(reminder)) as Reminder;
          const savedReminder = await newReminder.save();

          user.reminders.push({ reminderId: savedReminder._id });
          await user.save();

          io.to(socket.id).emit(EVENTS.SERVER.TIMER_CREATED);
          await watchTimers(userId, io, socket);
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
        const { reminders } = await Users.findById(userId).populate(
          'reminders.reminderId'
        );
        console.log({ reminders });

        const calculatedReminders: CalculatedReminder[] = [];

        reminders.forEach(
          ({ reminderId: reminder }: { reminderId: Reminder }) => {
            if (reminder) {
              const timeLeft = getTimeLeft(reminder);

              const calculatedReminder = {
                name: reminder.name,
                timeLeft,
                totalTime: reminder.time,
              } as CalculatedReminder;

              if (reminder.description)
                calculatedReminder.description = reminder.description;

              calculatedReminders.push(calculatedReminder);
            }
          }
        );

        io.to(socket.id).emit(EVENTS.SERVER.ALL_TIMERS, {
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
