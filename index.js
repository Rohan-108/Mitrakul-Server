import express from "express";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chats.routes.js";
import messageRouter from "./routes/message.routes.js";
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/message", messageRouter);
app.use(notFound);
app.use(errorHandler);
let server;
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    server = app.listen(PORT, () =>
      console.log("server started at http://localhost:5000")
    );
  } catch (error) {
    console.log(error.message);
  }
};
startServer();
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    socket.emit("connected" + room);
  });
  socket.on("new message", (messageReceived) => {
    const chat = messageReceived.chat;
    if (!chat.users) return console.log("chat users dont exist");
    chat.users.forEach((user) => {
      if (user._id == messageReceived.sender._id) return;
      socket.in(user._id).emit("message recieved", messageReceived);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
});
