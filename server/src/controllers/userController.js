import FriendRequest from "../models/friendRequest.js";
import User from "../models/User.js";

export const getRecommendedUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUser = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { $id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });
    res.status(200).json({ success: true, recommendedUser });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("error in getRecommendedUser", error);
  }
};

export const myFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("freinds")
      .populate(
        "freinds",
        "fullName profilePic  nativeLanguage learningLanguage"
      );
    res.status(200).json(user.freinds);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("error in myFriend", error);
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params.id;

    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "you cant send reqvest to your self" });
    }
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(400).json({ message: "recipient not found" });
    }
    if (recipient.freinds.includes(myId)) {
      return res
        .status(400)
        .json({ message: "you are already freind with this user" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "a freind reqvest already exist between you and this user",
      });
    }

    const freindRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(200).json(freindRequest);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("error in sendFreindrequest", error);
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params.id;
    const freindRequest = await FriendRequest.findById(requestId);

    if (!freindRequest) {
      return res.status(404).json({ message: "freind request not found" });
    }

    if (freindRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "you are not authorized to accept this request.." });
    }
    freindRequest.status = "accepted";
    await freindRequest.save();

    await User.findByIdAndUpdate(freindRequest.sender, {
      $addToSet: { freinds: freindRequest.recipient },
    });
    await User.findByIdAndUpdate(freindRequest.recipient, {
      $addToSet: { freinds: freindRequest.sender },
    });

    res.status(200).json({ message: "freind request accepted" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("error in acceptfreindReqvest", error);
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const incommingReqs = await FriendRequest.find({
      recipient: req.user.body,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.body,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incommingReqs, acceptedReqs });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("error in getfreindReqvest", error);
  }
};

export const getOutgoingFriendRequest = async (req, res) => {
  try {
    const outgoingReqs = await FriendRequest.find({
      sender: req.user.body,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    res.status(200).json(outgoingReqs);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("error in getOutgoingfreindReqvest", error);
  }
};
