import axios from "./axios";

export const getPendingCampaigns = async () => {
  const res = await axios.get("/admin/pending");
  return res.data;
};

export const approveCampaign = async (id) => {
  const res = await axios.put(`/admin/approve/${id}`);
  return res.data;
};

export const rejectCampaign = async (id) => {
  const res = await axios.put(`/admin/reject/${id}`);
  return res.data;
};