import mongoose, { Document, ObjectId } from 'mongoose';
import { Reminder } from './Reminders';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  reminders: [
    {
      reminderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Reminders',
      },
    },
  ],
});

const Users = mongoose.model('Users', UserSchema);

export default Users;

export interface User extends Document {
  reminders: { reminderId: ObjectId | Reminder }[];
}
