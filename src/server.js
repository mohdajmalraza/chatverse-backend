import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import app from "./app.js";
import { socketAuthMiddleware } from "./middleware/socket.middleware.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

// DB connection
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Authenticated socket connected:", socket.user.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.user.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
