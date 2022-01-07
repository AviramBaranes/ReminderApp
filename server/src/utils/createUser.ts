import { ObjectId } from 'mongoose';
import Users, { User } from '../models/User';

export const createUser = async () => {
  const userReminder = new Users({
    reminders: [],
  }) as User<ObjectId>;
  const newUser = await userReminder.save();
  return newUser;
};
