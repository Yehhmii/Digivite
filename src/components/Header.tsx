import React from 'react';

interface HeaderProps {
  eventTitle?: string;
  className?: string;
}

export default function Header({ eventTitle = "M'J FOREVER25", className = "" }: HeaderProps) {
  return (
    <header className={`relative z-20 py-6 ${className}`}>
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="flex items-center justify-center mb-3">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-[#D4AF37] font-semibold tracking-wider">
            {eventTitle}
          </h1>
        </div>
        
        <div className="relative w-32 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#D4AF37] rounded-full shadow-sm shadow-[#D4AF37]/50"></div>
        </div>
      </div>
    </header>
  );
}