import express from "express";
import {
  acceptFriendRequest,
  getFriendRequest,
  getOutgoingFriendRequest,
  getRecommendedUser,
  myFriend,
  sendFriendRequest,
} from "../controllers/userController.js";
import protectRoute from "../middalware/authMiddalware.js";

const route = express.Router();

route.use(protectRoute); //apply protectedRoute to all controller

route.get("/getrecommendeduser", getRecommendedUser);
route.get("/myfreind", myFriend);

route.post("/friend-request/:id", sendFriendRequest);
route.put("/friend-request/:id/accept", acceptFriendRequest);

route.get("/friend-requests", getFriendRequest);
route.get("/outgoing-friend-requests", getOutgoingFriendRequest);

export default route;
