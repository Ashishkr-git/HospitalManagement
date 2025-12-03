import React from "react";
import { Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle smooth scrolling
  const scrollToSection = (id) => {
    // 1. If not on Homepage, go there first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait a tiny bit for the page to load before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      // 2. If already on Homepage, just scroll
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Treatments", onClick: () => scrollToSection("treatments") },
    { label: "About Us", onClick: () => scrollToSection("about") },
  ];

  return (
    // 1. Fixed Container
    <div
      className="fixed top-4 left-0 right-0 z-50 w-[95%] max-w-[400px] mx-auto md:max-w-fit md:w-auto"
      style={{ fontFamily: '"Work Sans", sans-serif' }}
    >
      {/* Load Work Sans Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* 2. The Floating Pill */}
      <nav className="flex items-center justify-between md:justify-center p-1.5 pl-3 pr-1.5 bg-white/90 backdrop-blur-lg border border-gray-200/50 shadow-xl rounded-full transition-all duration-300">
        {/* LEFT: Home Icon (Scrolls to top) */}
        <div className="shrink-0">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center justify-center w-8 h-8 text-gray-700 transition-colors rounded-full hover:bg-gray-100"
          >
            <Home className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* MIDDLE: Links */}
        <div className="flex items-center gap-1 mx-1 md:mx-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.onClick}
              className="h-8 px-3 font-medium text-gray-600 transition-colors rounded-full cursor-pointer text-s md:text-sm md:px-5 hover:text-black hover:bg-gray-100/50"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="w-2" />
      </nav>
    </div>
  );
}
