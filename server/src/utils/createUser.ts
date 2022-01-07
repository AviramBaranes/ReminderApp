import Users, { User } from '../models/User';

export const createUser = async () => {
  const userReminder = new Users({
    reminders: [],
  }) as User;
  const newUser = await userReminder.save();
  return newUser;
};
