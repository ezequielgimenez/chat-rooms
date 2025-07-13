import mongoose from "mongoose";

const user = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  name: String,
  password: String,
});

export const modelUser = mongoose.model("users", user);
