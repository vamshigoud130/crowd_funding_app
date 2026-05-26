import React, { useEffect, useState } from 'react';
import axios from '../../store/axios.js';

function About() {
  const [statsData, setStatsData] = useState({
    campaignsCount: 0,
    totalRaised: 0,
    totalDonors: 0,
    livesImpacted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/campaigns/stats');
        setStatsData(res.data);
      } catch (err) {
        console.error("Failed to load statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Campaigns Funded", value: loading ? "..." : `${statsData.campaignsCount}` },
    { label: "Total Raised",     value: loading ? "..." : `₹${statsData.totalRaised.toLocaleString('en-IN')}` },
    { label: "Donors Worldwide", value: loading ? "..." : `${statsData.totalDonors}` },
    { label: "Lives Impacted",   value: loading ? "..." : `${statsData.livesImpacted}` },
  ];

  const steps = [
    { step: "1", title: "Create a Campaign", desc: "Set your goal, tell your story, and launch in minutes." },
    { step: "2", title: "Share It",          desc: "Spread the word across your network and social media." },
    { step: "3", title: "Receive Support",   desc: "Collect donations securely and track your progress live." },
  ];

  const values = [
    { icon: "🔒", title: "Trust & Transparency", desc: "Every rupee is tracked and reported to donors in real time." },
    { icon: "🤝", title: "Inclusivity",           desc: "We support causes from every community, background, and region." },
    { icon: "⚡", title: "Speed",                 desc: "Funds reach campaign owners quickly — no unnecessary delays." },
    { icon: "💬", title: "Community First",       desc: "Our platform is built around the people using it, always." },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          We believe every cause deserves a chance. CrowdFund connects passionate
          changemakers with a community ready to support them.
        </p>
      </section>

      {/* Mission */}
      <section className="bg-emerald-50 rounded-2xl p-10 text-center space-y-3">
        <h2 className="text-2xl font-semibold text-emerald-700">Our Mission</h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          To democratize fundraising — making it simple, transparent, and accessible
          for anyone with a meaningful cause. Whether it's education, healthcare,
          disaster relief, or creative projects, we're here to help ideas become impact.
        </p>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Our Impact So Far
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm p-6 text-center border border-emerald-50 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {steps.map((item) => (
            <div key={item.step} className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xl font-bold mx-auto">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-700">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 rounded-2xl p-10">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((val) => (
            <div key={val.title} className="flex gap-4 items-start">
              <span className="text-2xl">{val.icon}</span>
              <div>
                <p className="font-semibold text-gray-700">{val.title}</p>
                <p className="text-sm text-gray-500">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default About;