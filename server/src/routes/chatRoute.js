import express from "express";
import protectRoute from "../middalware/authMiddalware.js";
import { getStreamToken } from "../controllers/chatController.js";

const Route = express.Router();

Route.get("/token", protectRoute, getStreamToken);

export default Route;
