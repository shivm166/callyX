import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, rejectFriendRequest } from "../lib/api";
import toast from "react-hot-toast"; 

export const useFriendRequestActions = () => {
  const queryClient = useQueryClient();

  const { mutate: acceptRequestMutation, isPending: isAccepting } = useMutation(
    {
      mutationFn: (requestId) => acceptFriendRequest(requestId),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["incomingFriendReqs"] });
        queryClient.invalidateQueries({ queryKey: ["friends"] });

        toast.success(data.message || "Friend request accepted successfully!");
      },
      onError: (error) => {
        const message =
          error.response?.data?.message ||
          "Failed to accept request. Please try again.";
        toast.error(message);
      },
    }
  );

  const { mutate: rejectRequestMutation, isPending: isRejecting } = useMutation(
    {
      mutationFn: (requestId) => rejectFriendRequest(requestId),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["incomingFriendReqs"] });

        toast.success(data.message || "Friend request rejected successfully.");
      },
      onError: (error) => {
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
