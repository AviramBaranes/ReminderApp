import { RequestHandler } from 'express';
import { ObjectId } from 'mongoose';
import { Reminder } from '../models/Reminders';

import Users, { User } from '../models/User';

export const cleanUp: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.body);

    const { userId } = req.body;

    const UserReminders = (await Users.findById(userId).populate(
      'reminders.reminderId'
    )) as User<ObjectId | Reminder>;

    if (!UserReminders) {
      res.status(403).send('User not found');
      return;
    }

    const { reminders } = UserReminders as User<Reminder>;

    const updatedReminder: { reminderId: ObjectId }[] = [];

    reminders.forEach(({ reminderId: reminder }: { reminderId: Reminder }) => {
      if (reminder) updatedReminder.push({ reminderId: reminder._id });
    });

    (UserReminders as User<ObjectId>).reminders = updatedReminder;
    await UserReminders.save();

    res.status(200).send('Updated user data successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong, try tp refresh');
    return;
  }
};
