import express from "express";
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
const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(5000, () =>
      console.log("server started at http://localhost:5000")
    );
  } catch (error) {
    console.log(error.message);
  }
};
startServer();
