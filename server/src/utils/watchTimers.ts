import { ObjectId } from 'mongoose';
import { Server, Socket } from 'socket.io';

import { TimeOutsPointersList } from '../controller/socket';
import Reminders, { Reminder } from '../models/Reminders';
import Users, { User } from '../models/User';
import { EVENTS } from './EVENTS';
import { getTimeLeft } from './timeLeftCalculator';

const HEADS_UP = 3_000;

export const watchTimers = async (
  userId: string,
  io: Server,
  socket: Socket,
  timeOutPointersList: TimeOutsPointersList
) => {
  try {
    const { reminders } = (await Users.findById(userId).populate(
      'reminders.reminderId'
    )) as User<Reminder>;

    reminders.forEach(({ reminderId: reminder }) => {
      if (reminder) {
        const timeOut = getTimeLeft(reminder);

        if (timeOut < 0) {
          io.to(socket.id).emit(EVENTS.SERVER.TIMER_DONE, {
            name: reminder.name,
            done: true,
          });
          deleteReminder(reminder._id!);
        } else {
          let secondTimeOutPointer: NodeJS.Timeout | null = null;
          const timeLeft = HEADS_UP > timeOut ? timeOut : HEADS_UP; //default is 3 if smaller than the current time left
          const timeForFirstTimeOut =
            HEADS_UP > timeOut ? timeOut : timeOut - HEADS_UP; //same but 3 seconds before
          const firstTimeoutPointer = setTimeout(() => {
            io.to(socket.id).emit(EVENTS.SERVER.TIMER_DONE, {
              timeLeft,
              name: reminder.name,
              done: false,
            });
            secondTimeOutPointer = setTimeout(async () => {
              await deleteReminder(reminder._id!);
            }, HEADS_UP);
          }, timeForFirstTimeOut);

          timeOutPointersList.push({
            secondTimeOutPointer,
            firstTimeoutPointer,
          });
        }
      }
    });
  } catch (err) {
    io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
      message: "Couldn't find reminder",
    });
  }
};

async function deleteReminder(reminderId: ObjectId) {
  try {
    await Reminders.findByIdAndDelete(reminderId);
  } catch (err) {
    console.log(err);
  }
}
