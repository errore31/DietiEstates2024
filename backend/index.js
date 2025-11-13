import express from 'express';
import database from './models/database.js';
import session from 'express-session';

const app = express();
const Port = 3000;

app.use(session({
  secret: process.env.SESSION_SECRET || 'default',
  resave: false,
  saveUninitialized: false, 
  cookie: {
    maxAge: 1000 * 60, // 1 minute
    httpOnly: true, 
    secure: false 
  }
}));

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});