import { Server, Socket } from 'socket.io';
import { Reminder } from '../models/Reminders';
import Users from '../models/User';
import { EVENTS } from './EVENTS';
import { getTimeLeft } from './timeLeftCalculator';

interface CalculatedReminder {
  name: string;
  timeLeft: number;
  totalTime: number;
  description?: string;
}

export const getTimers = async (userId: string, io: Server, socket: Socket) => {
  try {
    const { reminders } = await Users.findById(userId).populate(
      'reminders.reminderId'
    );

    const calculatedReminders: CalculatedReminder[] = [];

    reminders.forEach(({ reminderId: reminder }: { reminderId: Reminder }) => {
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
    });

    io.to(socket.id).emit(EVENTS.SERVER.ALL_TIMERS, {
      calculatedReminders,
    });
  } catch (err) {
    console.log(err);
    io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
      message: 'Something went wrong',
    });
  }
};
