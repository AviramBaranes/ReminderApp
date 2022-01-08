import mongoose from 'mongoose';
async function connectDb() {
  const uri = process.env.MONGO_URI as string;
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default connectDb;
