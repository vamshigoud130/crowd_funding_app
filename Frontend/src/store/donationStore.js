import axios from "./axios";

export const donate = async (data) => {
  const res = await axios.post("/donations", data);
  return res.data;
};

export const getDonations = async (campaignId) => {
  const res = await axios.get(`/donations/campaign/${campaignId}`);
  return res.data;
};