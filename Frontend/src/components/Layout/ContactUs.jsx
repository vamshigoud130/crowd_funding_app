import React from "react";

const contacts = [
  { icon: "📞", label: "Phone", value: "+91 7981389738", href: "tel:+917981389738" },
  { icon: "✉️", label: "Email", value: "chenagonivamshi@gmail.com", href: "mailto:chenagonivamshi@gmail.com" },
  { icon: "📍", label: "Address", value: "Jodimetla,Hyderabad", href: null },
];

function ContactUs() {
  return (
    <div className="bg-white-80 min-h-screen flex items-center justify-center px-6 py-16 font-sans">
      <div className="w-full max-w-2xl">

        {/* Eyebrow */}
        <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#896727] mb-4">
          — Get in touch
        </p>

        {/* Heading */}
        <h1 className="font-serif text-5xl md:text-6xl text-[#594315] mb-3 leading-tight">
          Contact Us
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-[#45260c] font-light mb-12 leading-relaxed">
          For more inquiries, feel free to reach out through any of the channels below.
        </p>

        {/* Contact Cards */}
        <div className="flex flex-col gap-4">
          {contacts.map(({ icon, label, value, href }) => {
            const Tag = href ? "a" : "div";
            return (
              <Tag
                key={label}
                href={href}
                className="flex items-center gap-6 bg-white-70 border border-white-10 rounded-2xl px-7 py-6 no-underline text-inherit cursor-pointer transition-all duration-300 hover:bg-[#c8a96e] hover:border-[#c8a96e]/30 hover:translate-x-1.5 group"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-brown-500 border border-[#c8a96e]/20 flex items-center justify-center text-xl flex-wrap group-hover:bg-[#c8a96e]/20 transition-colors duration-300">
                  {icon}
                </div>

                {/* Text */}
                <div>
                  <div className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#c8a96e] mb-1">
                    {label}
                  </div>
                  <div className="text-base text-[#4e3709]">
                    {value}
                  </div>
                </div>
              </Tag>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="w-14 h-px bg-blend-to-r from-[#c8a96e] to-transparent mt-12 mb-8" />
        <p className="text-xs text-[#f0cfb9] font-light">
          We typically respond within 24 hours.
        </p>

      </div>
    </div>
  );
}

export default ContactUs;