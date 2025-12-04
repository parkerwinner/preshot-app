import { DotIcon } from "lucide-react";
import React from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";

const Footer = () => {
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/how-it-works", label: "How it works" },
    { to: "/camp-program", label: "Program" },
  ];
  const resources = [
    { to: "/blog", label: "Blog" },
    { to: "/faq", label: "Faq" },
    { to: "/support", label: "Support" },
    { to: "/community", label: "Community" },
  ];
  const contact = [
    { dot: DotIcon, name: "Email: hi@xavalabs.com" },
    { dot: DotIcon, label: "NullShot MCP" },
    { dot: DotIcon, label: "Europe" },
  ];
  return (
    <div>
      <div className="bg-[#171127] text-white w-full static left-0 right-0 bottom-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 py-10 md:py-14 lg:py-20 px-4 md:px-10 lg:px-10 justify-center">
          <div className="my-4">
            <div className="bg-[linear-gradient(90deg,_#007BFF_0%,_#232040_100%)] font-[700] text-[29.09px] text-black px-4">
              Preshot
            </div>
            <div className="py-4 mb-4 px-4">
              Your AI Powered Talent Readiness Engine for Talents, built with NullShot Mcp
            </div>
            <div className="flex gap-x-4 items-center px-4 text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-facebook-icon lucide-facebook"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter-icon lucide-twitter"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-instagram-icon lucide-instagram text-gray-100"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-linkedin-icon lucide-linkedin"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </div>
          </div>
          <div className="my-4 flex flex-col">
            <div className=" font-bold pb-5 text-xl">Quick Links</div>
            <div>
              {navLinks.map((link) => (
                <RouterNavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `hover:text-red-600 transition-colors ${
                      isActive ? "italic" : "flex flex-col gap-2 py-2"
                    }`
                  }
                >
                  {link.label}
                </RouterNavLink>
              ))}
            </div>
          </div>
          <div className="my-4 flex flex-col">
            <div className="font-bold pb-5 text-xl">Resources</div>
            <div>
              {resources.map((link) => (
                <RouterNavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `hover:text-red-600 transition-colors ${
                      isActive ? "italic" : "flex flex-col gap-2 py-2"
                    }`
                  }
                >
                  {link.label}
                </RouterNavLink>
              ))}
            </div>
          </div>
          <div className="my-4 flex flex-col">
            <div className="font-bold pb-5 text-xl">Contact</div>
            <div>
              {contact.map((item, index) => (
                <div
                  key={item.name || item.label || `contact-${index}`}
                  className="flex flex-row py-2  items-center gap-2"
                >
                  <item.dot size={16} />
                  {item.name || item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr className="border-2 border-[#232040]" />
        <div className=" text-center py-6 px-4">
          &copy; 2025 Preshot - NullShot MCP.{" "}
          <br className="md:hidden" /> All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
