import { axiosInstance } from "./axios";

export const rejectFriendRequest = async (requestId) => {
  const { data } = await axiosInstance.delete(`/users/rejectFriendRequest/${requestId}`);
  return data;
};

export const signup = async (signUpData) => {
  const response = await axiosInstance.post("/auth/signup", signUpData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  } catch (error) {
    console.log("Error in authentication", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/myFriend");
  return response.data || [];
};

export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users/recommended");
  return response.data?.users || [];
};

export const getOutgoingFriendReqs = async () => {
  const response = await axiosInstance.get("/users/outgoingFriendRequest");
  return response.data || [];
};

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/users/sendFriendRequest/${userId}`);
  return response.data;
};

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/getFriendRequest");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/acceptFriendRequest/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}
