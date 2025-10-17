import type { mongo } from "mongoose";

export interface UserType {
  _id: mongo.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "participant" | "organizer";
  createdAt: Date;
  updatedAt: Date;
}