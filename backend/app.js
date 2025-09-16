import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/UserRoute.js';


const app = express();
app.use(cors({
  origin: `${process.env.GOOGLE_OAUTH_REDIRECT_URI}`,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 3000;

connectDB().then(() => {
  console.log('Database connected successfully');
}).catch((error) => {
  console.log('Database connection failed', error);
});

app.use('/auth', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Task Management App!');
});