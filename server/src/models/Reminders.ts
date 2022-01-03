import mongoose, { Document, ObjectId } from 'mongoose';

const Schema = mongoose.Schema;

const RemindersSchema = new Schema({
  reminders: [
    {
      name: { type: String, required: true },

      description: { type: String, required: false },

      dateStarted: { type: Date, required: true },

      time: { type: Number, required: true },
    },
  ],
});

const Reminders = mongoose.model('Reminders', RemindersSchema);

export default Reminders;

export interface Reminder {
  name: string;
  description?: string;
  dateStarted: Date;
  time: number;
}

export interface RemindersType extends Document {
  _id: ObjectId;
  reminders: Reminder[];
}
