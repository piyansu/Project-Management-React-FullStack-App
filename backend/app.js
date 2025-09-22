import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import User from './models/User.js';
import connectDB from './config/db.js';
import userRoutes from './routes/UserRoute.js';
import projectRoutes from './routes/ProjectRoute.js';

const app = express();
const server = http.createServer(app);   // <-- wrap express in http server
const io = new Server(server, {
  cors: { origin: "*" }                 // allow React frontend
});

// ---------- Middleware ----------
app.use(cors({
  origin: `${process.env.GOOGLE_OAUTH_REDIRECT_URI}`,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------- MongoDB Connection ----------
connectDB().then(() => {
  console.log('Database connected successfully');
}).catch((error) => {
  console.log('Database connection failed', error);
});

// ---------- Routes ----------
app.use('/auth', userRoutes);
app.use('/projects', projectRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Task Management App!');
});

// ---------- Socket.IO Logic ----------
io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("userStatus", { userId, isOnline: true });
      console.log("User connected:", userId);
    } catch (error) {
      console.error("Error updating user status on connect:", error);
    }
  }

  socket.on("disconnect", async () => {
    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date()
        });
        io.emit("userStatus", { userId, isOnline: false, lastSeen: new Date() });
        console.log("User disconnected:", userId);
      } catch (error) {
        console.error("Error updating user status on disconnect:", error);
      }
    }
  });
});

// ---------- Start Server ----------
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
