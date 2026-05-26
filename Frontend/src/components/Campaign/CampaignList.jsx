import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCampaignStore } from "../../store/campaignStore";
import SearchBar from "./SearchBar";
import CampaignCard from "./CampaignCard";
import { Filter, Sparkles } from "lucide-react";

function CampaignList() {
  const { campaigns, getCampaigns, loading } = useCampaignStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isSuccessStories = location.pathname === "/success-stories";

  useEffect(() => {
    getCampaigns();
  }, [getCampaigns]);

  const gotoCampaign = (campaign) => {
    navigate(`/campaign/${campaign._id || campaign.id}`);
  };

  const filteredCampaigns = campaigns
    .filter((c) => c.status === 'approved')
    .filter((c) => {
      if (isSuccessStories) {
        return c.currentAmount >= c.goalAmount;
      }
      return true;
    })
    .filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-2xl text-red-500 font-medium">Failed to load campaigns</p>
        <button onClick={() => getCampaigns()} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">Try Again</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            {isSuccessStories ? "Success Stories" : "Discover Campaigns"} 
          </h1>
          <p className="text-gray-500">
            {isSuccessStories ? "Campaigns that have successfully reached their goals thanks to you." : "Support a cause you care about today."}
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-80">
            <SearchBar onSearch={setSearchTerm} />
          </div>
          <button className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xl text-gray-500 font-medium">No campaigns found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard 
              key={campaign._id || campaign.id}
              campaign={campaign}
              onClick={() => gotoCampaign(campaign)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CampaignList;
