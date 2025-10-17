import mongoose from "mongoose";

const connectToDb = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to DB");
};

export default connectToDb;