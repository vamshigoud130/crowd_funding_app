import axios from "./axios";

export const getDashboardData = async () => {
  const res = await axios.get("/analytics/dashboard");
  return res.data;
};