import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: string,
      default: "https://cdn-icons-png.flaticon.com/512/64/64572.png",
    },
  },
  { timestamps: true }
);
const userModel = mongoose.model("User", userSchema);
export default userModel;
