import React from "react";
import { Mail, Phone, MapPin, Clock, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const contacts = [
  { 
    icon: Phone, 
    label: "Phone Support", 
    value: "+91 7981389738", 
    desc: "Speak directly with our support experts.",
    href: "tel:+917981389738" 
  },
  { 
    icon: Mail, 
    label: "Email Us", 
    value: "crowdspark9@gmail.com", 
    desc: "For general or complex queries, we answer in 24 hrs.",
    href: "mailto:crowdspark9@gmail.com" 
  },
  { 
    icon: MapPin, 
    label: "Our Head Office", 
    value: "Jodimetla, Hyderabad, 500088", 
    desc: "Visit us by scheduling an appointment.",
    href: null 
  },
  { 
    icon: Clock, 
    label: "Support Hours", 
    value: "Mon - Sun, 24/7 Support", 
    desc: "Emergency support is always available.",
    href: null 
  },
];

function ContactUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-emerald-50 via-white to-white relative overflow-hidden">
      {/* Background Decorative Blur Spots */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-[-10%] w-80 h-80 rounded-full bg-blue-100/40 blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            We'd Love to Hear From You
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Have a question about fundraising, donations, or partnerships? Reach out and our team will support you.
          </p>
        </motion.div>

        {/* Content Grid (Centered 2x2 grid for contact cards) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {contacts.map((item, index) => {
            const IconComponent = item.icon;
            const Tag = item.href ? "a" : "div";
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className="block"
              >
                <Tag
                  href={item.href}
                  className={`flex items-start gap-5 p-6 bg-white/70 backdrop-blur-md border border-emerald-100/80 rounded-2xl transition-all duration-300 hover:shadow-md hover:border-emerald-300 hover:bg-white group h-full ${
                    item.href ? "cursor-pointer no-underline text-inherit" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                      {item.label}
                    </span>
                    <div className="text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors duration-200">
                      {item.value}
                    </div>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Tag>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default ContactUs;