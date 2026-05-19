import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, ShieldCheck, TrendingUp, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

function Home() {
  const categories = [
    { name: "Medical", icon: "🏥", color: "bg-red-50 text-red-600" },
    { name: "Education", icon: "📚", color: "bg-blue-50 text-blue-600" },
    { name: "Memorial", icon: "🕊️", color: "bg-purple-50 text-purple-600" },
    { name: "Emergency", icon: "🚨", color: "bg-orange-50 text-orange-600" },
    { name: "Non Profit", icon: "🤝", color: "bg-emerald-50 text-emerald-600" },
    { name: "Animals", icon: "🐾", color: "bg-amber-50 text-amber-600" }
  ];

  const steps = [
    { title: "Start your Fundraiser", desc: "It takes just 2 minutes", icon: <Heart className="w-6 h-6" /> },
    { title: "Share with Friends", desc: "Share on social media", icon: <Users className="w-6 h-6" /> },
    { title: "Receive Funds", desc: "Directly to your bank account", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50 to-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-200/50 blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-blue-200/50 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 space-y-8 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-medium text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                0% Platform Fee for Medical Emergencies
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Need Funds to Pay For a <span className="text-emerald-600">Medical Emergency?</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Over 20 Lakh+ people have successfully raised funds on ImpactFund. Start a free fundraiser today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <NavLink
                  to="/register"
                  className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 group hover:-translate-y-1"
                >
                  Start a free fundraiser
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </NavLink>
                <NavLink
                  to="/campaigns"
                  className="w-full sm:w-auto bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  Donate Now
                </NavLink>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  100% Safe & Secure
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Verified Campaigns
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Medical care support" 
                  className="w-full h-auto object-cover rounded-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <p className="font-medium text-lg">"Thanks to 500+ donors, my child's surgery was successful."</p>
                  <p className="text-emerald-300 text-sm mt-1">- Rajesh Kumar</p>
                </div>
              </div>

              {/* Floating Stat Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 border border-gray-100"
              >
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Community</p>
                  <p className="text-xl font-bold text-gray-900">20 Lakh+ Donors</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold text-center mb-8">What causes do you care about?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <NavLink 
              to={`/campaigns?category=${cat.name}`} 
              key={idx}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
            >
              <div className={cn("w-14 h-14 flex items-center justify-center text-3xl rounded-full mb-3 group-hover:scale-110 transition-transform", cat.color)}>
                {cat.icon}
              </div>
              <span className="font-medium text-gray-800">{cat.name}</span>
            </NavLink>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start a fundraiser in three simple steps</h2>
            <p className="text-gray-400">Our platform is designed to be easy, fast, and completely free to start.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gray-800 -translate-y-1/2 z-0"></div>

            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-gray-900 border-4 border-gray-800 rounded-full flex items-center justify-center text-emerald-500 mb-6 group-hover:border-emerald-500 group-hover:scale-110 transition-all shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <NavLink
              to="/register"
              className="inline-flex bg-emerald-500 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-400 transition-colors"
            >
              Start Free Fundraiser
            </NavLink>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 md:px-6 py-10">
        <div className="bg-emerald-50 rounded-3xl p-8 md:p-12 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Why choose ImpactFund?</h2>
            <p className="text-gray-600 text-lg">
              We are India's most trusted platform with the highest success rate. We provide 24x7 support and ensure zero platform fees for medical causes.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
              <h3 className="text-3xl font-bold text-emerald-600 mb-1">0%</h3>
              <p className="text-gray-600 font-medium">Platform Fee</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
              <h3 className="text-3xl font-bold text-emerald-600 mb-1">20L+</h3>
              <p className="text-gray-600 font-medium">Donors</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
              <h3 className="text-3xl font-bold text-emerald-600 mb-1">24x7</h3>
              <p className="text-gray-600 font-medium">Expert Support</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
              <h3 className="text-3xl font-bold text-emerald-600 mb-1">100%</h3>
              <p className="text-gray-600 font-medium">Secure Payments</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;