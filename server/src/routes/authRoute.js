import express from "express";
import {
  signup,
  signin,
  logout,
  onBoard,
} from "../controllers/authController.js";
import protectRoute from "../middalware/authMiddalware.js";

const route = express.Router();

route.post("/signup", signup);
route.post("/login", signin);
route.post("/logout", logout);

route.post("/onboarding", protectRoute, onBoard);
route.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ suceess: true, user: req.user });
});

export default route;
