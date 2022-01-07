import { ObjectId } from 'mongoose';
import { Server, Socket } from 'socket.io';

import { EVENTS } from '../controller/socket';
import Reminders, { Reminder } from '../models/Reminders';
import Users, { User } from '../models/User';
import { getTimeLeft } from './timeLeftCalculator';

const HEADS_UP = 3_000;

export const watchTimers = async (
  userId: string,
  io: Server,
  socket: Socket
) => {
  try {
    const { reminders } = (await Users.findById(userId).populate(
      'reminders.reminderId'
    )) as User;

    reminders.forEach((reminder) => {
      if (reminder.reminderId) {
        checkReminder(reminder.reminderId as Reminder, io, socket);
      }
    });
  } catch (err) {
    console.log(err);

    io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
      message: "Couldn't find reminder",
    });
  }
};

//exporting for new timers.
//(watchTimers will be called when client open, after that in order for watch new timers checkReminder will be called)
export const checkReminder = async (
  reminder: Reminder,
  io: Server,
  socket: Socket
) => {
  const timeOut = getTimeLeft(reminder);

  if (timeOut < 0) {
    io.to(socket.id).emit(EVENTS.SERVER.TIMER_DONE, {
      name: reminder.name,
      done: true,
    });
    await deleteReminder(reminder._id!);
  } else {
    const setTimeoutPointer = setTimeout(() => {
      io.to(socket.id).emit(EVENTS.SERVER.TIMER_DONE, {
        timeLeft: HEADS_UP,
        name: reminder.name,
        done: false,
      });
      setTimeout(async () => {
        await deleteReminder(reminder._id!);
      }, HEADS_UP);
    }, timeOut - HEADS_UP);

    socket.on('disconnected', () => clearTimeout(setTimeoutPointer));
  }
};

async function deleteReminder(reminderId: ObjectId) {
  try {
    await Reminders.findByIdAndDelete(reminderId);
    // const { reminders } = remindersModel;

    // const updatedReminders = reminders.filter(
    //   (r) => r._id!.toString() !== reminderId.toString()
    // );

    // remindersModel.reminders = updatedReminders;
    // await remindersModel.save();
  } catch (err) {
    console.log(err);
  }
}
