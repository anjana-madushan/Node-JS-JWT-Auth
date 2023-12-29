import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { DBConnection } from './config/db.js';

const app = express();

const PORT = process.env.PORT || 4000;

DBConnection();

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});