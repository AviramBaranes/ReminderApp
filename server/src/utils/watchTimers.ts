import { ObjectId } from 'mongoose';
import { Server, Socket } from 'socket.io';

import { EVENTS } from '../controller/socket';
import Reminders, { Reminder, RemindersType } from '../models/Reminders';
import { getTimeLeft } from './timeLeftCalculator';

const HEADS_UP = 3_000;

export const watchTimers = async (
  userId: string,
  io: Server,
  socket: Socket
) => {
  const remindersModel = (await Reminders.findById(userId)) as RemindersType;

  remindersModel.reminders.forEach((reminder) =>
    checkReminder(reminder, io, socket, remindersModel)
  );
};

//exporting for new timers.
//(watchTimers will be called when client open, after that in order for watch new timers checkReminder will be called)
export const checkReminder = (
  reminder: Reminder,
  io: Server,
  socket: Socket,
  reminders: RemindersType
) => {
  const timeOut = getTimeLeft(reminder);

  if (timeOut < 0) {
    io.to(socket.id).emit(EVENTS.SERVER.TIMER_DONE, {
      name: reminder.name,
      done: true,
    });
    deleteReminder(reminder._id!, reminders);
  } else {
    const timeout = setTimeout(() => {
      io.to(socket.id).emit(EVENTS.SERVER.TIMER_DONE, {
        timeLeft: HEADS_UP,
        name: reminder.name,
        done: false,
      });
      setTimeout(() => {
        deleteReminder(reminder._id!, reminders);
      }, HEADS_UP);
    }, timeOut - HEADS_UP);

    socket.on('disconnected', () => clearTimeout(timeout));
  }
};

async function deleteReminder(
  reminderId: ObjectId,
  remindersModel: RemindersType
) {
  try {
    const { reminders } = remindersModel;

    const updatedReminders = reminders.filter(
      (r) => r._id!.toString() !== reminderId.toString()
    );

    remindersModel.reminders = updatedReminders;
    await remindersModel.save();
  } catch (err) {
    console.log(err);
  }
}
