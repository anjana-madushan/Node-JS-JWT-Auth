import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import { DBConnection } from './config/db.js';
import router from './routes/user.js';

const app = express();
const PORT = process.env.PORT || 4000;
app.use(bodyParser.json());

app.use('/auth', router);

DBConnection();

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});