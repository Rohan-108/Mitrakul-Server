import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getMe,
  allUsers,
} from "../controllers/userContoller.js";

const router = express.Router();
router.route("/").post(registerUser).get(protect, allUsers);
router.route("/login").post(loginUser);
router.route("/me").post(protect, getMe);
export default router;
