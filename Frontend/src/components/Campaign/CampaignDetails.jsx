import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCampaignStore } from "../../store/campaignStore";
import ProgressBar from "./ProgressBar";
import TrustScore from "./TrustScore";
import DonationFeed from "../Donations/DonationFeed";
import { ShieldCheck, Share2, Heart, AlertCircle, ChevronRight, Users, Clock, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const { campaign, getCampaign, loading } = useCampaignStore();

  useEffect(() => {
    getCampaign(id);
  }, [id, getCampaign]);

  const progress = campaign
    ? Math.min(((campaign.currentAmount || 0) / (campaign.goalAmount || 1)) * 100, 100)
    : 0;

  const handleDonateClick = () => {
    navigate(`/donate/${id}`);
  };

  const handleShare = async () => {
    const shareData = {
      title: campaign.title,
      text: `Help support this campaign: ${campaign.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Error sharing campaign");
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  // Calculate days left from deadline
  const getDaysLeft = () => {
    if (!campaign?.deadline) return 0;
    const now = new Date();
    const deadline = new Date(campaign.deadline);
    const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Campaign Not Found</h2>
        <p className="text-gray-500 mt-2">The campaign you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/campaigns')} className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600">
          Browse Campaigns
        </button>
      </div>
    );
  }

  const campaignImage = campaign.images?.[0] || 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  const creatorName = campaign.creatorId?.name || campaign.creator || "Anonymous";

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/')} className="hover:text-emerald-600">Home</button>
        <ChevronRight className="w-4 h-4" />
        <button onClick={() => navigate('/campaigns')} className="hover:text-emerald-600">Campaigns</button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium truncate max-w-[200px]">{campaign.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column - Main Content */}
        <div className="lg:w-2/3 space-y-8">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <img
              src={campaignImage}
              alt={campaign.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {campaign.status === 'approved' && (
                <>
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" /> Verified Campaign
                  </span>
                </>
              )}
              {campaign.category && (
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100 capitalize">
                  {campaign.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {campaign.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-600 mb-8 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                  {creatorName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created by</p>
                  <p className="font-semibold text-gray-900">{creatorName}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg prose-emerald max-w-none text-gray-700">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About the Campaign</h3>
              <p className="whitespace-pre-line leading-relaxed">
                {campaign.description}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Words of Support
            </h3>
            <DonationFeed campaignId={campaign._id || campaign.id} key={refreshKey} />
          </div>
        </div>

        {/* Right Column - Sticky Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            
            {/* Donation Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
              
              <div className="mb-6">
                <p className="text-gray-500 text-sm font-medium mb-1">Funds Raised</p>
                <div className="flex items-end gap-2">
                  <h2 className="text-4xl font-extrabold text-gray-900">₹{(campaign.currentAmount || 0).toLocaleString()}</h2>
                  <p className="text-gray-500 mb-1 font-medium">of ₹{(campaign.goalAmount || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000 ease-out relative" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>{progress.toFixed(0)}% Funded</span>
                  <span className="text-emerald-600">{campaign.status === 'approved' ? 'Active' : campaign.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                  <Users className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-gray-900">{campaign.donors || 0}</p>
                  <p className="text-xs text-gray-500 font-medium">Donors</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                  <Clock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-gray-900">{getDaysLeft()}</p>
                  <p className="text-xs text-gray-500 font-medium">Days Left</p>
                </div>
              </div>

              <div className="space-y-4">
                {campaign.currentAmount >= campaign.goalAmount ? (
                  <div className="w-full bg-emerald-100 text-emerald-800 py-4 rounded-xl font-bold text-lg text-center border border-emerald-200 flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Goal Reached!
                  </div>
                ) : (
                  <button 
                    onClick={handleDonateClick}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5 fill-current" /> Donate Now
                  </button>
                )}
                <button 
                  onClick={handleShare}
                  className="w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" /> Share Campaign
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium bg-gray-50 py-3 rounded-lg border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                100% Secure & Trusted Payment
              </div>
            </div>

            {/* Trust Score Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Trust & Safety
              </h3>
              <TrustScore score={campaign.trustScore || 75} />
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                This campaign has been verified by our Trust & Safety team. The beneficiary's identity and documents have been authenticated.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;