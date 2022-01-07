export interface Reminder {
  userId?: string;
  name: string;
  description?: string;
  timeStarted: number;
  time: number;
}

export interface RemindersType extends Document {
  _id: ObjectId;
  reminders: Reminder[];
}
