import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not set");
}

export const mongoClient = new MongoClient(mongoUri);
export const mongodb = mongoClient.db();

export const connectDb = async () => {
  try {
    await mongoose.connect(mongoUri);
    await mongoClient.connect();

    return {
      mongooseConnection: mongoose.connection,
      mongoDatabase: mongodb,
    };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectDb;
