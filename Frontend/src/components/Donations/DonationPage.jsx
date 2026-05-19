import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCampaignStore } from "../../store/campaignStore";
import DonationForm from "./DonationForm";
import ImpactDetails from "./ImpactDetails";
import { ChevronRight, ShieldCheck, Heart, Sparkles, CheckCircle } from "lucide-react";

export default function DonationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const { campaign, getCampaign } = useCampaignStore();

  useEffect(() => {
    getCampaign(id);
  }, [id, getCampaign]);

  if (!campaign) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Complete Your Donation
              </h1>
              <p className="text-emerald-100 mt-2">You are one step away from making a difference.</p>
            </div>
            <div className="flex items-center gap-2 text-sm bg-emerald-800/50 px-4 py-2 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Secure Payment
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-emerald-600">Home</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate('/campaigns')} className="hover:text-emerald-600">Campaigns</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate(`/campaign/${campaign._id || campaign.id}`)} className="hover:text-emerald-600 truncate max-w-[150px]">
            {campaign.title}
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">Donate</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT SIDE → Donation Form & Payment Info */}
          <div className="lg:w-3/5 space-y-6">
            {campaign.currentAmount >= campaign.goalAmount ? (
              <div className="bg-white rounded-3xl shadow-xl border border-emerald-200 overflow-hidden p-10 text-center space-y-6">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Goal Successfully Reached!</h2>
                <p className="text-gray-600 text-lg">
                  Thank you so much! This campaign has already reached its funding goal of <span className="font-bold text-emerald-600">₹{(campaign.goalAmount || 0).toLocaleString()}</span>. 
                  Your generosity and support make our mission possible.
                </p>
                <button 
                  onClick={() => navigate('/campaigns')}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                >
                  Explore More Campaigns
                </button>
              </div>
            ) : (
              <DonationForm
                campaignId={campaign._id || campaign.id}
                campaignTitle={campaign.title}
                goalAmount={campaign.goalAmount}
                currentAmount={campaign.currentAmount}
                onAmountChange={setAmount}
                onSuccess={() => navigate(`/campaign/${campaign._id || campaign.id}?donated=true`)}
              />
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">We Accept</h3>
              <div className="flex items-center gap-4 flex-wrap opacity-60">
                <div className="h-8 w-16 bg-gray-200 rounded flex items-center justify-center font-bold text-xs text-gray-500">VISA</div>
                <div className="h-8 w-16 bg-gray-200 rounded flex items-center justify-center font-bold text-xs text-gray-500">MasterCard</div>
                <div className="h-8 w-16 bg-gray-200 rounded flex items-center justify-center font-bold text-xs text-gray-500">UPI</div>
                <div className="h-8 w-16 bg-gray-200 rounded flex items-center justify-center font-bold text-xs text-gray-500">Net Banking</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE → Campaign Summary & Impact */}
          <div className="lg:w-2/5">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24 space-y-6">
              
              <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-4">You are supporting</h3>
              
              <div className="flex gap-4">
                <img
                  src={campaign.images?.[0] || campaign.image || 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7'}
                  className="w-24 h-24 rounded-xl object-cover"
                  alt={campaign.title}
                />
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-2">{campaign.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{campaign.description}</p>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-emerald-900">Your Donation Impact</h4>
                    {amount > 0 ? (
                      <p className="text-sm text-emerald-700 mt-1">
                        A donation of <span className="font-bold">₹{amount}</span> makes a significant difference towards the goal.
                      </p>
                    ) : (
                      <p className="text-sm text-emerald-700 mt-1">
                        Enter an amount to see how your contribution helps.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Donation Guarantee</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xs text-gray-400">
                  ImpactFund guarantees that your funds will reach the verified beneficiary. In the rare case of misuse, your donation is protected.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}