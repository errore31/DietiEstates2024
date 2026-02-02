import express from 'express';
import {startConnection, setDataTest} from './models/database.js';
import session from 'express-session';
import 'dotenv/config';
import cors from 'cors';

import { authRouter } from './routes/authRoute.js';
import { proprietiesRouter } from './routes/propertiesRoute.js'
import { proprietiesFeaturesRouter } from './routes/propertiesFeaturesRoute.js'
import { agenciesRouter } from './routes/agenciesRoute.js'
import { searchesRouter } from './routes/searchesRoute.js'
import { notificationsRouter } from './routes/notificationsRoute.js'
import { errorHandler } from './middleware/errorHandler.js';


const app = express();
const Port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true // Permette lo scambio di cookie tra domini diversi
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default',
  resave: false,
  saveUninitialized: false, 
  cookie: {
    maxAge: 10000 * 60, // 5 minutes
    httpOnly: true, 
    secure: false 
  }
}));

await startConnection();
await setDataTest(); // Populate the database with test data

app.use("/auth", authRouter);
app.use("/properties", proprietiesRouter)
app.use("/propertiesFeatures", proprietiesFeaturesRouter)
app.use("/agencies", agenciesRouter)
app.use("/searches", searchesRouter)
app.use("/notifications", notificationsRouter)
app.use(errorHandler);


app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});

