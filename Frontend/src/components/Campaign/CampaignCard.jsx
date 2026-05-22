import React from 'react';
import { NavLink } from 'react-router-dom';
import * as Progress from '@radix-ui/react-progress';
import { Clock, Users, ShieldCheck } from 'lucide-react';

function CampaignCard({ campaign, onClick }) {
  const raised = campaign.currentAmount || campaign.raisedAmount || campaign.raised || 0;
  const goal = campaign.goalAmount || campaign.goal || 100000;
  const progress = Math.min((raised / goal) * 100, 100);

  // Calculate days left from deadline
  const getDaysLeft = () => {
    if (!campaign.deadline) return 0;
    const now = new Date();
    const deadline = new Date(campaign.deadline);
    const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  };
  const daysLeft = getDaysLeft();

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.image || campaign.images?.[0] || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 text-emerald-700 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" /> Tax Benefit
        </div>
        {campaign.isUrgent && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm animate-pulse">
            Urgent
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-3 group-hover:text-emerald-600 transition-colors">
          {campaign.title}
        </h3>

        <div className="mt-auto space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1.5 font-medium">
              <span className="text-gray-900">₹{raised.toLocaleString()} raised</span>
              <span className="text-gray-500">{progress.toFixed(0)}%</span>
            </div>
            
            <Progress.Root className="relative overflow-hidden bg-gray-100 rounded-full w-full h-2">
              <Progress.Indicator
                className="bg-emerald-500 w-full h-full transition-transform duration-1000 ease-out"
                style={{ transform: `translateX(-${100 - progress}%)` }}
              />
            </Progress.Root>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 font-medium pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{campaign.donorsCount ?? campaign.donors ?? 0} Donors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{daysLeft} Days Left</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignCard;