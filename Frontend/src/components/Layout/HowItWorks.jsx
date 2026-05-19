import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Users, TrendingUp } from 'lucide-react';

function HowItWorks() {
  const steps = [
    { title: "Start your Fundraiser", desc: "It takes just 2 minutes to set up your campaign and share your story.", icon: <Heart className="w-10 h-10" /> },
    { title: "Share with Friends", desc: "Share on social media, email, and WhatsApp to reach potential donors.", icon: <Users className="w-10 h-10" /> },
    { title: "Receive Funds", desc: "Receive the funds directly to your bank account securely.", icon: <TrendingUp className="w-10 h-10" /> }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How ImpactFund Works</h1>
          <p className="text-lg text-gray-600">
            Our platform is designed to make fundraising as easy, transparent, and effective as possible.
            Whether you are raising money for a medical emergency, a personal cause, or a charity, we are here to help you succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 bg-emerald-200 -translate-y-1/2 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-24 h-24 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-100 group-hover:scale-110 transition-all shadow-md">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <NavLink
            to="/create-campaign"
            className="inline-flex bg-emerald-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
          >
            Start a Fundraiser Today
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
