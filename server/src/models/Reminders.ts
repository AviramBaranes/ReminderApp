import mongoose, { Document, ObjectId } from 'mongoose';

const Schema = mongoose.Schema;

const RemindersSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },

  name: { type: String, required: true },

  description: { type: String, required: false },

  timeStarted: { type: Number, required: true },

  time: { type: Number, required: true },
});

const Reminders = mongoose.model('Reminders', RemindersSchema);

export default Reminders;

export interface Reminder extends Document {
  userId?: ObjectId;
  name: string;
  description?: string;
  timeStarted: number;
  time: number;
}
