import express from "express";
import {
  getRecommendedUser,
  myFriend,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest, // Import the new controller
  getFriendRequest,
  getOutgoingFriendRequest,
} from "../controllers/userController.js";
import protectRoute from "../middalware/authMiddalware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/recommended", getRecommendedUser);
router.get("/myFriend", myFriend);
router.post("/sendFriendRequest/:id", sendFriendRequest);
router.get("/getFriendRequest", getFriendRequest);
router.get("/outgoingFriendRequest", getOutgoingFriendRequest);
router.put("/acceptFriendRequest/:id", acceptFriendRequest);

// 👇 NEW ROUTE ADDED FOR REJECTION 👇
router.delete("/rejectFriendRequest/:id", rejectFriendRequest);

export default router;
