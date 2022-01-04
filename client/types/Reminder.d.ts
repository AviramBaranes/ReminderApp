export interface Reminder {
  userId?: string;
  name: string;
  description?: string;
  date: Date;
  time: number;
}

export interface RemindersType extends Document {
  _id: ObjectId;
  reminders: Reminder[];
}
