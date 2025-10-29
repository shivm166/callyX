import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logout } from "../lib/api"; // your async logout API function
import useAuthUser from "../hooks/useAuthUSer";

const HomePage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { authUser, isLoading } = useAuthUser(); // custom hook

  // Logout mutation
  const { mutate: logoutMutation, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.removeQueries({ queryKey: ["authUser"] }); // clears cache
      navigate("/login"); // redirect to login
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Logout failed");
    },
  });

  const handleLogout = () => {
    logoutMutation();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium">Loading user info...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {authUser?.fullName || "User"}!
        </h1>
        <p className="text-gray-600 mb-6">
          You are logged in. Click below to logout.
        </p>
        <button
          onClick={handleLogout}
          disabled={isPending}
          className={`btn w-full py-2 rounded-lg text-white ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
