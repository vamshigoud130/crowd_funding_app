import { useState } from "react";
import { useCampaignStore } from "../../store/campaignStore";

const CreateCampaign = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    goalAmount: "",
    currentAmount: 0,
    deadline: "",
    images: null,
    documents: null,
    // stretchGoals: "",
    impactUnit: "people helped",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { createCampaign } = useCampaignStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "stretchGoals" && value) {
          // stretchGoals as JSON string
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      await createCampaign(formData);

      setForm({
        title: "",
        description: "",
        category: "",
        goalAmount: "",
        currentAmount: 0,
        deadline: "",
        images: null,
        documents: null,
        // stretchGoals: "",
        impactUnit: "people helped",
      });
    } catch (err) {
      setError(err.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Create Campaign</h2>

      <label className="block font-semibold mb-1">Category</label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
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

      <input
        type="text"
        name="title"
        placeholder="e.g. Help for Surgery"
        value={form.title}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Describe the situation and why you need funds..."
        value={form.description}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="number"
        name="goalAmount"
        placeholder="e.g. 100000 (in INR)"
        value={form.goalAmount}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="number"
        name="currentAmount"
        placeholder="Current Amount (default 0)"
        value={form.currentAmount}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        min={0}
        readOnly
      />

      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <label className="block font-semibold mb-1">Image</label>
      <input
        type="file"
        name="images"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full mb-3"
      />

      <label className="block font-semibold mb-1">Documents</label>
      <input
        type="file"
        name="documents"
        accept="application/pdf,image/*"
        onChange={handleFileChange}
        className="w-full mb-3"
      />

      {/* <label className="block font-semibold mb-1">Stretch Goals (JSON)</label>
      <textarea
        name="stretchGoals"
        placeholder='[{"amount": 200000, "description": "Second surgery"}]'
        value={form.stretchGoals}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      /> */}

      <input
        type="text"
        name="impactUnit"
        placeholder="Impact Unit (e.g., people helped)"
        value={form.impactUnit}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
        <button
          type="button"
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded font-semibold"
          onClick={() => setForm({
            title: "",
            description: "",
            category: "",
            goalAmount: "",
            currentAmount: 0,
            deadline: "",
            images: null,
            documents: null,
            stretchGoals: "",
            impactUnit: "people helped",
          })}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateCampaign;