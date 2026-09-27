import mongoose from 'mongoose';

const connectDB = async () => {
  // Prevent Mongoose from buffering operations when disconnected
  mongoose.set('bufferCommands', false);
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ethicalai';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn('[MongoDB] Running with local persistent file storage fallback.');
  }
};

export default connectDB;

