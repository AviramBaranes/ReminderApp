import mongoose from 'mongoose';
async function connectDb() {
  const uri =
  process.env.MONGO_URI || 
    'mongodb+srv://Hlife11:hlifeJJ003nz@hlife.pzl2m.mongodb.net/reminderApp?retryWrites=true&w=majority';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default connectDb;
