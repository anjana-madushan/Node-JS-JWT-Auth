import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const DBConnection = async () => {
  try {
    mongoose.connect(process.env.link);
    const { connection } = mongoose;
    connection.once('open', () => {
      console.log('Mongo DB is connected successfully!!!')
    })
  } catch (error) {
    console.log(`data base connection error`, error)
  }
}