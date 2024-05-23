import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';
import contactRoutes from './routes/contactRoutes.js'; 
import loginRoute from './routes/loginRoute.js';
import removebgAPI from './routes/removebgAPI.js';
import openAIRoutes from './routes/openAIroutes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from DALL.E!',
  });
});

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', loginRoute);
app.use('/remove-background', removebgAPI);
app.use('/classify-text', openAIRoutes); 

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(3000, () => console.log('Server started on port 3000'));
  } catch (error) {
    console.log(error);
  }
  
};

startServer();
