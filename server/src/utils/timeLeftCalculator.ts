import { Reminder } from '../models/Reminders';

export const getTimeLeft = (reminder: Reminder) => {
  const startTime = new Date(reminder.dateStarted).getTime();
  const reminderTime = reminder.time * 1000;
  const endTime = startTime + reminderTime;
  const currentTime = Date.now();

  return endTime - currentTime;
};
