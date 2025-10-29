import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "unauthorized - no token provided" });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({ message: "unauthorized - invalid token " });
    }
    console.log(decode);
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "unauthorized - user not found " });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in protected route ", error);
    res.status(500).json("internal server error");
  }
};

export default protectRoute;
