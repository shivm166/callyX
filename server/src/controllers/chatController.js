import { genarateStreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    const token = genarateStreamToken(req.user.id);
    res.status(200).json({ token });
  } catch (error) {
    console.log("error in getStreamToken controller :", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
