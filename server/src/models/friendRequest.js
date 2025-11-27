import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// 🚀 SCALABILITY IMPROVEMENT: Add compound indexes for query performance

// Speeds up finding incoming pending requests (used in getFriendRequest)
friendRequestSchema.index({ recipient: 1, status: 1 });

// Speeds up checking for existing pending requests (used in sendFriendRequest)
// The compound index is directional, but the controller queries both directions ($or)
friendRequestSchema.index({ sender: 1, recipient: 1, status: 1 });

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
