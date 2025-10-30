// import { axiosInstance } from "./axios";

// export const signup = async (signUpData) => {
//   const response = await axiosInstance.post("/auth/signup", signUpData);
//   return response.data;
// };

// export const getAuthUser = async () => {
//   try {
//     const res = await axiosInstance.get("/auth/me");
//     return res.data;
//   } catch (error) {
//     // console.log("error in authentication", error);
//     return null;
//   }
// };

// export const completeOnboarding = async (userData) => {
//   const response = await axiosInstance.post("/auth/onboarding", userData);
//   return response.data;
// };

// export const logout = async () => {
//   const response = await axiosInstance.post("/auth/logout");
//   return response.data;
// };

// export const login = async (loginData) => {
//   const response = await axiosInstance.post("/auth/login", loginData);
//   return response.data;
// };

// export const getUserFriends = async () => {
//   const response = await axiosInstance.post("/users/login", loginData);
//   return response.data;
// };
// export const getUsersFriends = async () => {
//   const response = await axiosInstance.get("/users/myfriend");
//   return response.data;
// };
// export const getRecommendedUsers = async () => {
//   const response = await axiosInstance.get("/users/getrecommendeduser");
//   return res.data.users;
// };
// export const getOutgoingFriendReqs = async () => {
//   const response = await axiosInstance.get("/users/outgoing-friend-requests");
//   return response.data;
// };

// export const sendFriendRequest = async (userId) => {
//   const response = await axiosInstance.post(`/users/friend-request/${userId}`);
//   return response.data;
// };

import { axiosInstance } from "./axios";

// 🧠 Auth APIs
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

// 🧩 Friend APIs
export const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/myfriend");
  return response.data || [];
};

export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users/getrecommendeduser");
  console.log("recommended users response:", response.data);
  return response.data?.users || [];
};

export const getOutgoingFriendReqs = async () => {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data || [];
};

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
};
