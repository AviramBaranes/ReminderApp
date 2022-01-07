import { ObjectId } from 'mongoose';
import Reminders, { Reminder } from '../models/Reminders';
import { User } from '../models/User';

export const createReminder = async (
  userId: string,
  name: string,
  time: number,
  timeStarted: number,
  description: string | undefined,
  user: User<ObjectId>
) => {
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
};
