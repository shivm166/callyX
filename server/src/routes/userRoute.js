import express from "express";
import {
  getRecommendedUser,
  myFriend,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequest,
  getOutgoingFriendRequest
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
router.put("/acceptFriendRequest/:id/accept", acceptFriendRequest);
router.delete("/rejectFriendRequest/:requestId", rejectFriendRequest);

export default router;
