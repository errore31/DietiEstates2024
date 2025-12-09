import express from 'express';
import database from './models/database.js';
import session from 'express-session';

import { authRouter } from './routes/authRoute.js';
import { proprietiesRouter } from './routes/propertiesRoute.js'
import { proprietiesFeaturesRouter } from './routes/propertiesFeaturesRoute.js'
import { agenciesRouter } from './routes/agenciesRoute.js'
import { searchesRouter } from './routes/searchesRoute.js'
import { notificationsRouter } from './routes/notificationsRoute.js'


const app = express();
const Port = 3000;

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'default',
  resave: false,
  saveUninitialized: false, 
  cookie: {
    maxAge: 5000 * 60, // 5 minutes
    httpOnly: true, 
    secure: false 
  }
}));

try {
  await database.authenticate(); 
  await database.sync({ force: true });
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use("/auth", authRouter);
app.use("/properties", proprietiesRouter)
app.use("/propertiesFeatures", proprietiesFeaturesRouter)
app.use("/agencies", agenciesRouter)
app.use("/searches", searchesRouter)
app.use("/notifications", notificationsRouter)


app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});