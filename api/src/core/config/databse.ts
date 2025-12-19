import mongoose from "mongoose";

const connectDb = (): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  return mongoose.connect(mongoUri);
};

export default connectDb;
