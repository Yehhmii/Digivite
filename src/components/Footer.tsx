import React from 'react';

interface FooterProps {
  message?: string;
  tagline?: string;
  className?: string;
}

export default function Footer({ 
  message = "Created with care and attention to detail",
  tagline = "We look forward to celebrating with you",
  className = ""
}: FooterProps) {
  return (
    <footer className={`bg-gradient-to-r from-transparent via-amber-50 to-transparent border-t border-amber-200/30 pb-8 ${className}`}>
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="mb-4">
          <span className="text-amber-600 text-xl opacity-60 animate-pulse">❦</span>
        </div>
        
        <div className="text-amber-700 font-serif space-y-1">
          <p className="text-sm font-light tracking-wide">
            {message}
          </p>
          <p className="text-xs italic text-amber-600 opacity-80">
            {tagline}
          </p>
        </div>
        
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4 relative">
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full opacity-60"></div>
          <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full opacity-60"></div>
        </div>
        
        {/* Corner decorative elements */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-amber-500 text-sm opacity-20 hidden md:block animate-bounce">
          ❦
        </div>
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-amber-500 text-sm opacity-20 hidden md:block animate-bounce" style={{ animationDelay: '1s' }}>
          ❦
        </div>
      </div>
    </footer>
  );
}