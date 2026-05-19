import { create } from 'zustand';
import axios from "./axios";

export const useCampaignStore = create((set, get) => ({
  campaigns: [],
  campaign: null,
  loading: false,

  getCampaigns: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("/campaigns");
      set({ campaigns: res.data.campaigns || res.data });
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      set({ campaigns: [] });
    } finally {
      set({ loading: false });
    }
  },

  getCampaign: async (id) => {
    try {
      set({ loading: true });
      const res = await axios.get(`/campaigns/${id}`);
      set({ campaign: res.data });
    } catch (err) {
      console.error("Error fetching campaign:", err);
      set({ campaign: null });
    } finally {
      set({ loading: false });
    }
  },

  createCampaign: async (data) => {
    try {
      let config = {};
      let payload = data;
      if (typeof FormData !== 'undefined' && data instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const res = await axios.post("/campaigns", payload, config);
      set((state) => ({
        campaigns: [res.data, ...state.campaigns]
      }));
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success('Campaign created! Awaiting admin approval.');
      }
      return res.data;
    } catch (err) {
      console.error("Error creating campaign:", err);
      throw err;
    }
  },

  updateCampaign: async (id, data) => {
    try {
      const res = await axios.put(`/campaigns/${id}`, data);
      set((state) => ({
        campaigns: state.campaigns.map((c) => (c._id === id ? res.data : c)),
        campaign: state.campaign && state.campaign._id === id ? res.data : state.campaign
      }));
      return res.data;
    } catch (err) {
      console.error("Error updating campaign:", err);
      throw err;
    }
  },

  deleteCampaign: async (id) => {
    try {
      await axios.delete(`/campaigns/${id}`);
      set((state) => ({
        campaigns: state.campaigns.filter((c) => c._id !== id),
        campaign: state.campaign && state.campaign._id === id ? null : state.campaign
      }));
    } catch (err) {
      console.error("Error deleting campaign:", err);
      throw err;
    }
  },
}));
