import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../store/axios.js';
import useAuthStore from '../../store/authStore';
import { ShieldAlert, IndianRupee, Megaphone, CheckCircle, XCircle, Activity, Trash2, Ban, UserCheck, Users } from 'lucide-react';
import { cn } from "../../utils";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [pending, setPending] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [fraud, setFraud] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalDonations: 0, active: 0, byCategory: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Analytics Modal State
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [selectedAnalytics, setSelectedAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Confirm delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const [pendingRes, allRes, fraudRes, usersRes] = await Promise.all([
        axios.get('/admin/campaigns/pending'),
        axios.get('/campaigns'),
        axios.get('/admin/fraud-logs'),
        axios.get('/admin/users'),
      ]);
      setPending(pendingRes.data);
      const campaignsArray = allRes.data.campaigns || allRes.data;
      setAllCampaigns(Array.isArray(campaignsArray) ? campaignsArray : []);
      setFraud(fraudRes.data);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      
      const campaignsList = Array.isArray(campaignsArray) ? campaignsArray : [];
      const active = campaignsList.filter(c => c.status === 'approved').length;
      const byCategory = {};
      let totalDonations = 0;
      campaignsList.forEach(c => {
        if (c.status === 'approved') {
          byCategory[c.category] = (byCategory[c.category] || 0) + 1;
          totalDonations += c.totalDonations || 0;
        }
      });
      setStats({ totalDonations, active, byCategory });
    } catch (err) {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/user-dashboard');
    } else {
      fetchAll();
    }
  }, [user, navigate]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const approve = async (id) => {
    try {
      await axios.put(`/admin/campaigns/${id}/approve`);
      setPending(pending.filter(c => c._id !== id));
      showSuccess("Campaign approved successfully!");
      fetchAll();
    } catch (err) {
      setError("Failed to approve campaign");
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(`/admin/campaigns/${id}/reject`);
      setPending(pending.filter(c => c._id !== id));
      showSuccess("Campaign rejected.");
      fetchAll();
    } catch (err) {
      setError("Failed to reject campaign");
    }
  };

  const deleteCampaign = async (id) => {
    try {
      await axios.delete(`/admin/campaigns/${id}`);
      setAllCampaigns(allCampaigns.filter(c => c._id !== id));
      setPending(pending.filter(c => c._id !== id));
      setDeleteTarget(null);
      showSuccess("Campaign deleted successfully!");
      fetchAll();
    } catch (err) {
      setError("Failed to delete campaign");
    }
  };

  const toggleBlock = async (userId) => {
    try {
      const res = await axios.put(`/admin/users/${userId}/block`);
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: res.data.user.isBlocked } : u));
      showSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user status");
    }
  };

  const viewAnalytics = async (id) => {
    try {
      setAnalyticsLoading(true);
      setAnalyticsModalOpen(true);
      const res = await axios.get(`/analytics/campaigns/${id}`);
      setSelectedAnalytics(res.data);
    } catch (err) {
      setError("Failed to load campaign analytics");
      setAnalyticsModalOpen(false);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-emerald-900 border-b border-emerald-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-8 h-8 text-emerald-400" /> Admin Command Center
              </h1>
              <p className="text-emerald-200 mt-1">Platform overview and moderation tools.</p>
            </div>
            <div className="flex gap-3">
              {successMsg && <div className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium animate-pulse">{successMsg}</div>}
              {error && <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">{error}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Loading platform data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Donations</h3>
                  <span className="text-2xl font-bold text-gray-900">₹{stats.totalDonations.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Active Campaigns</h3>
                  <span className="text-2xl font-bold text-gray-900">{stats.active}</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Campaigns</h3>
                  <span className="text-2xl font-bold text-gray-900">{allCampaigns.length}</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Pending Review</h3>
                  <span className="text-2xl font-bold text-gray-900">{pending.length}</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
                  <span className="text-2xl font-bold text-gray-900">{users.filter(u => u.role !== 'admin').length}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (Main Tasks) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Pending Approvals */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-orange-500" /> Pending Approvals
                    </h3>
                    <span className="bg-orange-100 text-orange-700 py-1 px-3 rounded-full text-xs font-bold">{pending.length} items</span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    {pending.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">No campaigns pending review.</div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="p-4 pl-6">Campaign Info</th>
                            <th className="p-4">Goal</th>
                            <th className="p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {pending.map(c => (
                            <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                              <td className="p-4 pl-6">
                                <p className="font-bold text-gray-900">{c.title}</p>
                                <p className="text-xs text-gray-500">By: {c.creatorId?.name || 'N/A'}</p>
                              </td>
                              <td className="p-4 font-medium text-gray-700">₹{c.goalAmount?.toLocaleString()}</td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <button onClick={() => approve(c._id)} className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
                                    <CheckCircle className="w-4 h-4" /> Approve
                                  </button>
                                  <button onClick={() => reject(c._id)} className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                                    <XCircle className="w-4 h-4" /> Reject
                                  </button>
                                  <button onClick={() => setDeleteTarget(c)} className="flex items-center gap-1 bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Fraud Alerts */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                   <div className="px-6 py-5 border-b border-red-100 bg-red-50">
                    <h3 className="font-bold text-red-900 text-lg flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5" /> Fraud Alerts
                    </h3>
                  </div>
                  <div className="p-0">
                    <ul className="divide-y divide-gray-100">
                      {fraud.length === 0 ? (
                        <li className="p-6 text-gray-500 text-center">No fraud campaigns detected. Platform is clean.</li>
                      ) : (
                        fraud.map(f => (
                          <li key={f._id} className="p-4 flex flex-col md:flex-row justify-between md:items-center gap-2 hover:bg-gray-50">
                            <span className="font-bold text-gray-900">{f.campaignId?.title}</span>
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">{f.reason}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>

                {/* Active Campaigns with Delete */}
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-emerald-100 bg-emerald-50 flex justify-between items-center">
                    <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5" /> All Campaigns
                    </h3>
                    <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-full text-xs font-bold">{allCampaigns.length} total</span>
                  </div>
                  <div className="overflow-x-auto">
                    {allCampaigns.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">No campaigns.</div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="p-4 pl-6">Campaign Info</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Goal</th>
                            <th className="p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {allCampaigns.map(c => (
                            <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                              <td className="p-4 pl-6">
                                <p className="font-bold text-gray-900">{c.title}</p>
                                <p className="text-xs text-gray-500">By: {c.creatorId?.name || 'N/A'}</p>
                              </td>
                              <td className="p-4">
                                <span className={cn(
                                  "px-2.5 py-1 text-xs font-semibold rounded-full",
                                  c.status === 'approved' ? "bg-emerald-100 text-emerald-700" :
                                  c.status === 'pending' ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                                )}>
                                  {c.status?.charAt(0).toUpperCase() + c.status?.slice(1)}
                                </span>
                              </td>
                              <td className="p-4 font-medium text-gray-700">₹{c.goalAmount?.toLocaleString()}</td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <button onClick={() => viewAnalytics(c._id)} className="flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                    <Activity className="w-4 h-4" /> Analytics
                                  </button>
                                  <button onClick={() => setDeleteTarget(c)} className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column (Overview) */}
              <div className="space-y-8">
                
                {/* Campaigns by Category */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Categories Breakdown</h3>
                  <ul className="space-y-3">
                    {Object.entries(stats.byCategory).length === 0 ? (
                      <li className="text-gray-400 text-sm text-center py-4">No category data</li>
                    ) : (
                      Object.entries(stats.byCategory).map(([cat, count]) => (
                        <li key={cat} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="capitalize font-medium text-gray-700">{cat}</span>
                          <span className="bg-white px-2.5 py-1 rounded-lg text-sm font-bold text-gray-900 border border-gray-200 shadow-sm">{count}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* All Users with Block/Unblock */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                       <Users className="w-5 h-5 text-indigo-500" /> User Management
                    </h3>
                    <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-xs font-bold">{users.filter(u => u.role !== 'admin').length} users</span>
                  </div>
                  <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                    {users.filter(u => u.role !== 'admin').length === 0 ? (
                      <li className="p-6 text-gray-500 text-center">No users found.</li>
                    ) : (
                      users.filter(u => u.role !== 'admin').map(u => (
                        <li key={u._id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-gray-900 truncate">{u.name}</p>
                                {u.isBlocked && (
                                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">Blocked</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1 truncate">{u.email}</p>
                            </div>
                            <button
                              onClick={() => toggleBlock(u._id)}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ml-3 whitespace-nowrap",
                                u.isBlocked 
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                                  : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                              )}
                            >
                              {u.isBlocked ? (
                                <><UserCheck className="w-3.5 h-3.5" /> Unblock</>
                              ) : (
                                <><Ban className="w-3.5 h-3.5" /> Block</>
                              )}
                            </button>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Campaign?</h2>
            <p className="text-gray-500 mb-2">Are you sure you want to permanently delete:</p>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
              <p className="font-bold text-gray-900">{deleteTarget.title}</p>
              <p className="text-xs text-gray-500 mt-1">By: {deleteTarget.creatorId?.name || 'N/A'}</p>
            </div>
            <p className="text-red-600 text-sm mb-6">⚠️ This action cannot be undone. The campaign creator will be notified via email.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteCampaign(deleteTarget._id)} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {analyticsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Campaign Analytics</h2>
              <button onClick={() => setAnalyticsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            {analyticsLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            ) : selectedAnalytics ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedAnalytics.campaign.title}</h3>
                  <div className="flex gap-4 mt-2">
                    <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded">Status: {selectedAnalytics.campaign.status}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Goal: ₹{selectedAnalytics.campaign.goalAmount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Donated</p>
                    <p className="text-xl font-bold text-emerald-600">₹{selectedAnalytics.donationStats.totalAmount}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Donors</p>
                    <p className="text-xl font-bold text-blue-600">{selectedAnalytics.donationStats.totalDonors}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Average Donation</p>
                    <p className="text-xl font-bold text-purple-600">₹{Math.round(selectedAnalytics.donationStats.averageDonation || 0)}</p>
                  </div>
                </div>

                {selectedAnalytics.dailyDonations && selectedAnalytics.dailyDonations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Daily Trends (Recent)</h4>
                    <ul className="space-y-2">
                      {selectedAnalytics.dailyDonations.map((day, idx) => (
                        <li key={idx} className="flex justify-between bg-gray-50 p-2 rounded text-sm">
                          <span>{day._id}</span>
                          <span className="font-medium text-emerald-600">+₹{day.amount} ({day.count} donations)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">No analytics data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
