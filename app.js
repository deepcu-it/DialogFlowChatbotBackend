import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from 'cors';
import connectToMongoDB from "./databases/MongoDBConnection.js";

connectToMongoDB();
import { initializeDB } from './databases/mysqlConnection.js';
//await initializeDB();

const app = express();


// Security middlewares
app.use(helmet());
app.use(xss());
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Application routes
import userRoutes from './routes/userRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import chatRoutes from './routes/mysqlRoutes.js';
app.use("/user", userRoutes);
app.use('/webhook', webhookRoutes);
app.use('/chat', chatRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});