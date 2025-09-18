import React from 'react';
import { FaHeartbeat, FaHandHoldingHeart } from "react-icons/fa";
import {GiEternalLove} from "react-icons/gi";

interface FooterProps {
  message?: string;
  tagline?: string;
  className?: string;
}

export default function Footer({ 
  message = "We eagerly await your response",
  tagline = "Your presence would be appreciated",
  className = ""
}: FooterProps) {
  return (
    <footer className={`relative bg-gradient-to-t from-black/90 to-black/60 border-t border-[#D4AF37]/30 py-12 ${className}`}>
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="mb-6">
          <span className="text-[#D4AF37] text-2xl opacity-70 animate-pulse"><GiEternalLove className='text-red-800 mx-auto'/></span>
        </div>

        <div className="text-white font-dm-serif space-y-3">
          <p className="text-base md:text-lg font-light tracking-wide">
            {message}
          </p>
          <p className="text-sm italic text-[#D4AF37]/80 font-playfair">
            {tagline}
          </p>
        </div>

        <div className="w-24 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6 relative">
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#D4AF37] rounded-full opacity-70"></div>
          <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#D4AF37] rounded-full opacity-70"></div>
        </div>

        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-[#722F37] text-lg opacity-30 hidden md:block animate-bounce">
          <FaHeartbeat className='text-white w-12 h-12'/>
        </div>
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-[#D4AF37] text-lg opacity-30 hidden md:block animate-bounce" style={{ animationDelay: '1s' }}>
          <FaHandHoldingHeart className='text-red-800 w-12 h-12'/>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
      </div>
    </footer>
  );
}