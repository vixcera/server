import mongoose from 'mongoose';

const users = new mongoose.Schema(
  {
    username: { type: String },
    password: { type: String },
    reftoken: { type: String },
    email: { type: String },
    agent: { type: String },
    img: { type: String },
    id: { type: String },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('users', users);
