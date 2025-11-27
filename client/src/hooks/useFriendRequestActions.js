import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, rejectFriendRequest } from "../lib/api";
import toast from "react-hot-toast"; // Assuming you use react-hot-toast for messages

export const useFriendRequestActions = () => {
  const queryClient = useQueryClient();

  // --- 📧 ACCEPT MUTATION ---
  const { mutate: acceptRequestMutation, isPending: isAccepting } = useMutation(
    {
      mutationFn: (requestId) => acceptFriendRequest(requestId),
      onSuccess: (data) => {
        // Invalidate queries to refresh the list of incoming requests and friends list
        queryClient.invalidateQueries({ queryKey: ["incomingFriendReqs"] });
        queryClient.invalidateQueries({ queryKey: ["friends"] });

        // ✅ SUCCESS MESSAGE
        // The backend returns a message key, use it here
        toast.success(data.message || "Friend request accepted successfully!");
      },
      onError: (error) => {
        // ❌ ERROR MESSAGE
        const message =
          error.response?.data?.message ||
          "Failed to accept request. Please try again.";
        toast.error(message);
      },
    }
  );

  // --- 🗑️ REJECT MUTATION ---
  const { mutate: rejectRequestMutation, isPending: isRejecting } = useMutation(
    {
      mutationFn: (requestId) => rejectFriendRequest(requestId),
      onSuccess: (data) => {
        // Invalidate the incoming requests list
        queryClient.invalidateQueries({ queryKey: ["incomingFriendReqs"] });

        // ✅ SUCCESS MESSAGE
        // The backend returns a message key, use it here
        toast.success(data.message || "Friend request rejected successfully.");
      },
      onError: (error) => {
        // ❌ ERROR MESSAGE
        const message =
          error.response?.data?.message ||
          "Failed to reject request. Please try again.";
        toast.error(message);
      },
    }
  );

  return {
    acceptRequestMutation,
    isAccepting,
    rejectRequestMutation,
    isRejecting,
  };
};
