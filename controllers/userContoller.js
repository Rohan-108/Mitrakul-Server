import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../mongodb/models/user.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "please fill all fields" });
    }
    //check if user exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({ message: "user already exists" });
    }
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create the User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      pic,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//for login the user with jwt
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "please fill all fields" });
    }
    const user = await User.findOne({ email });
    if (!user) res.status(400).json({ message: "user doesn't exist" });
    if (user && (await bcrypt.compare(password, user.password))) {
      const userDetails = {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      };
      res.status(200).json(userDetails);
    } else res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    res.status(500).json(error);
  }
};
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

//////geettttiec all usersss/////
const allUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json(error);
  }
};
////genrate the token for login /////
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
export { registerUser, loginUser, getMe, allUsers };
