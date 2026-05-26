import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDonations } from "../../store/donationStore";
import { Heart } from "lucide-react";

export default function DonationFeed({ campaignId }) {
    const params = useParams();
    const effectiveCampaignId = campaignId || params?.id;

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!effectiveCampaignId) return;

        const fetchDonations = async () => {
            try {
                setLoading(true);
                const data = await getDonations(effectiveCampaignId);
                setDonations(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch donations:", err);
                setDonations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, [effectiveCampaignId]);

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading donations...</div>;
    }

    return (
        <div className="space-y-4">
            {donations.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 text-center">
                    <Heart className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No donations yet. Be the first to contribute!</p>
                </div>
            ) : (
                donations.map((donation) => (
                    <div
                        key={donation._id || donation.id}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-emerald-600">₹{donation.amount?.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 font-medium">
                                {donation.anonymous ? 'Anonymous' : (donation.donorId?.name || donation.guestName || 'Supporter')}
                            </span>
                        </div>
                        {donation.message && (
                            <p className="text-sm text-gray-600 mt-2 italic">"{donation.message}"</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                            {new Date(donation.createdAt || donation.date).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}
