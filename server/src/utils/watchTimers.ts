import { ObjectId } from 'mongoose';
import { Server, Socket } from 'socket.io';

import { EVENTS } from '../controller/socket';
import Reminders, { Reminder, RemindersType } from '../models/Reminders';
import { getTimeLeft } from './timeLeftCalculator';

export const watchTimers = async (
  userId: string,
  io: Server,
  socketId: Socket['id']
) => {
  const remindersModel = (await Reminders.findById(userId)) as RemindersType;

  remindersModel.reminders.forEach((reminder) =>
    checkReminder(reminder, io, socketId, remindersModel)
  );
};

//exporting for new timers.
//(watchTimers will be called when client open, after that in order for watch new timers checkReminder will be called)
export const checkReminder = (
  reminder: Reminder,
  io: Server,
  socketId: Socket['id'],
  reminders: RemindersType
) => {
  const timeOut = getTimeLeft(reminder);

  console.log(timeOut);

  if (timeOut < 0) {
    io.to(socketId).emit(EVENTS.SERVER.TIMER_DONE, {
      name: reminder.name,
      done: true,
    });
    deleteReminder(reminder._id!, reminders);
  } else {
    setTimeout(() => {
      console.log('done');

      io.to(socketId).emit(EVENTS.SERVER.TIMER_DONE, {
        name: reminder.name,
        done: false,
      });
      deleteReminder(reminder._id!, reminders);
    }, timeOut - 10000);
  }
};

async function deleteReminder(
  reminderId: ObjectId,
  remindersModel: RemindersType
) {
  try {
    const { reminders } = remindersModel;

    const currentReminderIndex = reminders.findIndex(
      (r) => r._id === reminderId
    );
    reminders.splice(currentReminderIndex, 1);

    await remindersModel.save();
  } catch (err) {
    console.log(err);
  }
}
