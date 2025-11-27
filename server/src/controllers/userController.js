import FriendRequest from "../models/friendRequest.js";
import User from "../models/User.js";
import {
  sendRequestNotification,
  sendAcceptanceNotification,
} from "../lib/emailService.js";

export const getRecommendedUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUser = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } }, // ✅ Corrected: checks if current user already has friend
        { isOnboarded: true },
      ],
    });

    res.status(200).json({ users: recommendedUser }); // ✅ consistent key
  } catch (error) {
    console.log("error in getRecommendedUser", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const myFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic  nativeLanguage learningLanguage"
      );
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("error in myFriend", error);
  }
};

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // 1. prevent sending req to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // FIX: Check if users are already friends
    const isRecipientFriendOfSender = recipient.friends.some(
      (friendId) => friendId.toString() === myId
    );
    const isSenderFriendOfRecipient = req.user.friends.some(
      (friendId) => friendId.toString() === recipientId
    );

    if (isRecipientFriendOfSender || isSenderFriendOfRecipient) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    // FIX: check if a PENDING req already exists (prevents duplicate request creation)
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId, status: "pending" },
        { sender: recipientId, recipient: myId, status: "pending" },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message:
          "A pending friend request already exists between you and this user",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    // 🚀 ASYNCHRONOUS EMAIL NOTIFICATION
    sendRequestNotification(myId, recipientId);

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const acceptFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const acceptorId = req.user.id;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "friend request not found" });
    }

    if (friendRequest.recipient.toString() !== acceptorId) {
      return res
        .status(403)
        .json({ message: "you are not authorized to accept this request." });
    }

    // Proper message for when it's already accepted
    if (friendRequest.status === "accepted") {
      return res
        .status(200)
        .json({ message: "friend request already accepted." });
    }

    const senderId = friendRequest.sender;

    // Performance improvement using Promise.all for parallel updates
    await Promise.all([
      FriendRequest.updateOne(
        { _id: requestId },
        { $set: { status: "accepted" } }
      ),
      User.findByIdAndUpdate(senderId, {
        $addToSet: { friends: acceptorId },
      }),
      User.findByIdAndUpdate(acceptorId, {
        $addToSet: { friends: senderId },
      }),
    ]);

    // 🚀 ASYNCHRONOUS EMAIL NOTIFICATION
    sendAcceptanceNotification(acceptorId, senderId);

    // Proper success message
    res.status(200).json({ message: "friend request accepted successfully." });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("error in acceptfriendReqvest", error);
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const currentUserId = req.user.id;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      // Proper message if request doesn't exist (e.g., already rejected or accepted)
      return res.status(404).json({ message: "friend request not found." });
    }

    if (friendRequest.recipient.toString() !== currentUserId) {
      return res
        .status(403)
        .json({ message: "you are not authorized to reject this request." });
    }

    // For rejection, the simplest and cleanest way is to delete the request document.
    await FriendRequest.deleteOne({ _id: requestId });

    // Proper success message
    res.status(200).json({ message: "friend request rejected successfully." });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("error in rejectFriendRequest", error);
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("error in getfriendReqvest", error);
  }
};

export const getOutgoingFriendRequest = async (req, res) => {
  try {
    const outgoingReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    res.status(200).json(outgoingReqs);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("error in getOutgoingfriendReqvest", error);
  }
};
