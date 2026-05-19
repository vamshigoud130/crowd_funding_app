import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useCampaignStore } from "../../store/campaignStore";
import {
  Megaphone,
  Image,
  Calendar,
  IndianRupee,
  Tag,
  FileText,
  Sparkles,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { value: "medical", label: "Medical", emoji: "🏥" },
  { value: "education", label: "Education", emoji: "📚" },
  { value: "environment", label: "Environment", emoji: "🌿" },
  { value: "disaster", label: "Disaster Relief", emoji: "🆘" },
  { value: "community", label: "Community", emoji: "🤝" },
  { value: "other", label: "Other", emoji: "💡" },
];

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createCampaign } = useCampaignStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    goalAmount: "",
    deadline: "",
    impactUnit: "people helped",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Login Required
          </h2>
          <p className="text-gray-500 mb-8">
            You need to be logged in to create a campaign. Please login or
            create an account to get started.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              Login to Continue
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-bold transition-colors"
            >
              Create Account
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let base64Image = null;
      if (imageFile) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
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
        images: base64Image,
      };

      await createCampaign(payload);
      setSuccess(true);

      // Redirect to dashboard after a short delay
      setTimeout(() => navigate("/user-dashboard"), 2000);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to create campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Campaign Created!
          </h2>
          <p className="text-gray-500 mb-2">
            Your campaign has been submitted and is awaiting admin approval.
          </p>
          <p className="text-sm text-gray-400">
            Redirecting to your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  // Minimum date is today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-200 hover:text-white mb-6 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-3">
            <Megaphone className="w-8 h-8" /> Start Your Fundraiser
          </h1>
          <p className="text-emerald-100 text-lg max-w-xl">
            Tell your story, set your goal, and start raising funds for a cause
            that matters. Your campaign will be visible to everyone once approved.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <button onClick={() => navigate("/")} className="hover:text-emerald-600">Home</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">Create Campaign</span>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-500" /> Choose a Category
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Select the category that best describes your campaign.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.value })}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      form.category === cat.value
                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <span
                      className={`font-semibold text-sm ${
                        form.category === cat.value
                          ? "text-emerald-700"
                          : "text-gray-700"
                      }`}
                    >
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" /> Campaign
                Details
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Provide information about your campaign to build trust with
                potential donors.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="E.g., Help Ravi fight cancer"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-gray-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tell donors your story — why do you need help? How will the funds be used?"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all h-40 resize-none text-gray-900"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    A detailed description helps build trust and encourages
                    donations.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Impact Unit
                  </label>
                  <input
                    name="impactUnit"
                    value={form.impactUnit}
                    onChange={handleChange}
                    placeholder="E.g., people helped, meals served, trees planted"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Goal & Deadline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" /> Goal &
                Timeline
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Set a realistic fundraising goal and deadline.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" /> Goal Amount (₹) *
                  </label>
                  <input
                    name="goalAmount"
                    value={form.goalAmount}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    placeholder="50000"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-gray-900 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Deadline *
                  </label>
                  <input
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    type="date"
                    min={today}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Campaign Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Image className="w-5 h-5 text-emerald-500" /> Campaign Image
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Upload a compelling image that represents your campaign.
              </p>

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-emerald-400 transition-all">
                  <Image className="w-10 h-10 text-gray-400 mb-3" />
                  <span className="text-sm font-medium text-gray-500">
                    Click to upload an image
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading || !form.category}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        d="M12 3a9 9 0 0 1 9 9"
                      />
                    </svg>
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <Megaphone className="w-5 h-5" /> Create Campaign
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="sm:w-40 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 text-sm font-semibold">
                  What happens next?
                </p>
                <p className="text-blue-700 text-xs mt-1">
                  After submission, your campaign will be reviewed by our admin
                  team. Once approved, it will be visible to everyone on the
                  Campaigns page and donors can start contributing.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
