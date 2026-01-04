import mongoose from "mongoose";

const connectDb = async (): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }
  const connection = await mongoose.connect(mongoUri);
  console.log("-------------------------------------------------------------");
  console.log(`MongoDB connected on ${connection.connection.host}`);
  return connection;
};

export default connectDb;
