import jwt from "jsonwebtoken";
import User from "../mongodb/models/user.js";

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token   sksn
      token = req.headers.authorization.split(" ")[1];
      //verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      //
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  }
  if (!token) {
    res.status(400).json({ message: "token not there" });
  }
};
export default protect;
