import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useCampaignStore } from "../../store/campaignStore";
import { getDonations } from "../../store/donationStore";
import axios from "../../store/axios";
import { LayoutDashboard, Megaphone, IndianRupee, Plus, Edit, Trash2, X, Heart, TrendingUp } from "lucide-react";
import { cn } from "../../utils";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { createCampaign, updateCampaign, deleteCampaign } = useCampaignStore();

  const [userCampaigns, setUserCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [allDonations, setAllDonations] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [createError, setCreateError] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    goalAmount: "",
    deadline: "",
    images: null,
    impactUnit: "people helped",
  });

  // Fetch user's campaigns directly from backend
  const fetchUserCampaigns = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await axios.get(`/campaigns/user/${user._id}`);
      const campaignsData = Array.isArray(res.data) ? res.data : (res.data.campaigns || []);
      setUserCampaigns(campaignsData);

      // Fetch donations for all user campaigns
      let allDons = [];
      for (const camp of campaignsData) {
        try {
          const donsRes = await getDonations(camp._id);
          if (Array.isArray(donsRes)) {
            allDons = [...allDons, ...donsRes.map(d => ({ ...d, campaignTitle: camp.title }))];
          }
        } catch (e) {
          // skip if donations fetch fails for a campaign
        }
      }
      setAllDonations(allDons);
    } catch (err) {
      console.error("Failed to fetch user campaigns:", err);
      setUserCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserCampaigns();
    }
  }, [user]);

  const handleSelectCampaign = async (campaign) => {
    setSelectedCampaign(campaign);
    try {
      const data = await getDonations(campaign._id);
      setDonations(Array.isArray(data) ? data : []);
    } catch (e) {
      setDonations([]);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCreate = async () => {
    setCreateError("");
    try {
      let base64Image = null;
      if (form.images) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(form.images);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        goalAmount: Number(form.goalAmount),
        deadline: form.deadline,
        impactUnit: form.impactUnit,
        images: base64Image
      };

      await createCampaign(payload);
      setShowForm(false);
      setForm({ title: "", description: "", category: "", goalAmount: "", deadline: "", images: null, impactUnit: "people helped" });
      fetchUserCampaigns();
    } catch (err) {
      setCreateError(err?.response?.data?.message || "Failed to create campaign");
    }
  };

  const handleUpdate = async () => {
    if (!selectedCampaign) return;
    try {
      let base64Image = null;
      if (form.images && typeof form.images !== "string") {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(form.images);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        goalAmount: Number(form.goalAmount),
        deadline: form.deadline,
        impactUnit: form.impactUnit || "people helped",
      };

      if (base64Image) {
        payload.images = base64Image;
      }

      await updateCampaign(selectedCampaign._id, payload);
      setShowForm(false);
      setSelectedCampaign(null);
      fetchUserCampaigns();
    } catch (err) {
      setCreateError(err?.response?.data?.message || "Failed to update campaign");
    }
  };

  const handleDelete = async (id) => {
    await deleteCampaign(id);
    setSelectedCampaign(null);
    fetchUserCampaigns();
  };

  // Analytics calculations
  const totalRaised = userCampaigns.reduce((sum, c) => sum + (c.currentAmount || 0), 0);
  const totalDonationsCount = allDonations.length;
  const totalDonationsAmount = allDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const selectedDonationsTotal = donations.reduce((sum, d) => sum + d.amount, 0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl text-gray-500 font-medium">Please login to access your dashboard.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <LayoutDashboard className="w-8 h-8 text-emerald-500" /> Welcome back, {user?.name}
              </h1>
              <p className="text-gray-500 mt-1">Manage your campaigns and track donations.</p>
            </div>
            <button
              onClick={logout}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Megaphone className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">Your Campaigns</h2>
                  <span className="text-3xl font-bold text-gray-900">{userCampaigns.length}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <IndianRupee className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">Total Raised</h2>
                  <span className="text-3xl font-bold text-gray-900">₹{totalRaised.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <Heart className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">Total Donors</h2>
                  <span className="text-3xl font-bold text-gray-900">{totalDonationsCount}</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl shadow-sm p-6 text-white flex flex-col justify-center">
                 <h2 className="text-lg font-bold mb-2 text-emerald-50">Start a new journey</h2>
                 <button
                   onClick={() => navigate('/create-campaign')}
                   className="bg-white text-emerald-700 w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors shadow-sm"
                 >
                   <Plus className="w-5 h-5" /> Create Campaign
                 </button>
              </div>
            </div>

            {/* Campaign List */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                My Campaigns
              </h2>
              
              {userCampaigns.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 border-dashed p-12 text-center">
                  <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900">No campaigns yet</h3>
                  <p className="text-gray-500 mt-2">Create your first campaign to start raising funds.</p>
                  <button
                    onClick={() => navigate('/create-campaign')}
                    className="mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Create Campaign
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCampaigns.map((c) => (
                    <div key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
                      <div className="flex-grow cursor-pointer" onClick={() => handleSelectCampaign(c)}>
                        <div className="flex justify-between items-start mb-3">
                          <span className={cn(
                            "px-2.5 py-1 text-xs font-semibold rounded-full",
                            c.status === 'approved' ? "bg-emerald-100 text-emerald-700" : 
                            c.status === 'pending' ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                          )}>
                            {c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : "Pending"}
                          </span>
                          <span className="text-xs text-gray-400 font-medium capitalize">{c.category}</span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">{c.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{c.description}</p>
                        
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min((c.currentAmount || 0) / (c.goalAmount || 1) * 100, 100)}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mb-4">
                          ₹{(c.currentAmount || 0).toLocaleString()} of ₹{(c.goalAmount || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
                        <button
                          onClick={() => {
                            setShowForm(true);
                            setSelectedCampaign(c);
                            setForm({
                              title: c.title,
                              description: c.description,
                              category: c.category,
                              goalAmount: c.goalAmount,
                              deadline: c.deadline?.substring(0, 10) || "",
                              images: null,
                              impactUnit: c.impactUnit || "people helped",
                            });
                          }}
                          className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex justify-center items-center gap-1.5"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex justify-center items-center gap-1.5"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Campaign Donations */}
            {selectedCampaign && (
              <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Donations for "{selectedCampaign.title}"
                  </h3>
                  <button onClick={() => { setSelectedCampaign(null); setDonations([]); }} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-sm text-emerald-600 font-medium">Total Received</p>
                    <p className="text-2xl font-bold text-emerald-700">₹{selectedDonationsTotal.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-sm text-blue-600 font-medium">Number of Donors</p>
                    <p className="text-2xl font-bold text-blue-700">{donations.length}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-sm text-purple-600 font-medium">Avg Donation</p>
                    <p className="text-2xl font-bold text-purple-700">₹{donations.length > 0 ? Math.round(selectedDonationsTotal / donations.length).toLocaleString() : 0}</p>
                  </div>
                </div>

                {donations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p>No donations received yet for this campaign.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {donations.map((d) => (
                      <div key={d._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-900">
                            {d.anonymous ? "Anonymous" : (d.donorId?.name || "Supporter")}
                          </p>
                          {d.message && <p className="text-sm text-gray-500 mt-1 italic">"{d.message}"</p>}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <span className="text-xl font-bold text-emerald-600">₹{d.amount?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {selectedCampaign ? "Edit Campaign" : "Create New Campaign"}
            </h2>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                selectedCampaign ? handleUpdate() : handleCreate();
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="medical">Medical</option>
                  <option value="education">Education</option>
                  <option value="environment">Environment</option>
                  <option value="disaster">Disaster</option>
                  <option value="community">Community</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="E.g., Help John fight cancer"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Tell your story..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none h-32 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount (₹)</label>
                  <input
                    name="goalAmount"
                    value={form.goalAmount}
                    onChange={handleFormChange}
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    name="deadline"
                    value={form.deadline}
                    onChange={handleFormChange}
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Image</label>
                <input
                  name="images"
                  type="file"
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              {createError && (
                <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm">{createError}</div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-6"
              >
                {selectedCampaign ? "Save Changes" : "Create Campaign"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;