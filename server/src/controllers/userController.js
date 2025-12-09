import FriendRequest from "../models/friendRequest.js";
import User from "../models/User.js";
import {
  sendRequestNotification,
  sendAcceptanceNotification
} from "../lib/emailService.js";

export const getRecommendedUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const recommendedUser = await User.find({
      _id: { $ne: currentUserId, $nin: req.user.friends },
      isOnboarded: true
    });
    res.status(200).json({ users: recommendedUser });
  } catch (error) {
    console.error("getRecommendedUser error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const myFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");
    res.status(200).json(user.friends || []);
  } catch (error) {
    console.error("myFriend error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const recipientId = req.params.id;

    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    const alreadyFriends =
      recipient.friends.some((id) => id.toString() === myId) ||
      req.user.friends.some((id) => id.toString() === recipientId);
    if (alreadyFriends) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    const existingPending = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId, status: "pending" },
        { sender: recipientId, recipient: myId, status: "pending" }
      ]
    });

    if (existingPending) {
      if (existingPending.sender.toString() === recipientId && existingPending.recipient.toString() === myId) {
        await Promise.all([
          FriendRequest.updateOne({ _id: existingPending._id }, { $set: { status: "accepted" } }),
          User.findByIdAndUpdate(recipientId, { $addToSet: { friends: myId } }),
          User.findByIdAndUpdate(myId, { $addToSet: { friends: recipientId } })
        ]);
        sendAcceptanceNotification(myId, recipientId);
        return res.status(200).json({ message: "Mutual request found — accepted and added as friends" });
      }
      return res.status(400).json({ message: "A pending friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({ sender: myId, recipient: recipientId });
    sendRequestNotification(myId, recipientId);
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("sendFriendRequest error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const acceptFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const acceptorId = req.user.id;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (friendRequest.recipient.toString() !== acceptorId) {
      return res.status(403).json({ message: "You are not authorized to accept this request." });
    }
    if (friendRequest.status === "accepted") {
      return res.status(200).json({ message: "Friend request already accepted." });
    }
    const senderId = friendRequest.sender.toString();
    await Promise.all([
      FriendRequest.updateOne({ _id: requestId }, { $set: { status: "accepted" } }),
      User.findByIdAndUpdate(senderId, { $addToSet: { friends: acceptorId } }),
      User.findByIdAndUpdate(acceptorId, { $addToSet: { friends: senderId } })
    ]);
    sendAcceptanceNotification(acceptorId, senderId);
    res.status(200).json({ message: "Friend request accepted successfully." });
  } catch (error) {
    console.error("acceptFriendRequest error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const userId = req.user.id;
    const request = await FriendRequest.findOne({
      _id: requestId,
      recipient: userId,
      status: "pending"
    });
    if (!request) {
      return res.status(404).json({ message: "Friend request not found or already handled" });
    }
    await FriendRequest.findByIdAndDelete(requestId);
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("rejectFriendRequest error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const incomingReqs = await FriendRequest.find({ recipient: req.user.id, status: "pending" }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");
    const acceptedReqs = await FriendRequest.find({ sender: req.user.id, status: "accepted" }).populate("recipient", "fullName profilePic");
    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.error("getFriendRequest error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getOutgoingFriendRequest = async (req, res) => {
  try {
    const outgoingReqs = await FriendRequest.find({ sender: req.user.id, status: "pending" }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
    res.status(200).json(outgoingReqs);
  } catch (error) {
    console.error("getOutgoingFriendRequest error", error);
    res.status(500).json({ message: "internal server error" });
  }
};
