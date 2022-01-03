import Reminders, { RemindersType } from '../models/Reminders';

export const createUser = async () => {
  const userReminder = new Reminders({
    reminders: [],
  }) as RemindersType;
  await userReminder.save();
  return userReminder;
};
