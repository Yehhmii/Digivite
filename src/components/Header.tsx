import React from 'react';

interface HeaderProps {
  eventTitle?: string;
  className?: string;
}

export default function Header({ eventTitle = "Elegant Event", className = "" }: HeaderProps) {
  return (
    <header className={`bg-gradient-to-r from-transparent via-amber-50 to-transparent border-b border-amber-200/30 py-3 ${className}`}>
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="text-amber-600 text-2xl opacity-70 animate-pulse">❦</span>
          <h1 className="text-xl md:text-4xl font-serif text-amber-800 font-light tracking-wide">
            {eventTitle}
          </h1>
          <span className="text-amber-600 text-2xl opacity-70 animate-pulse">❦</span>
        </div>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-3 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-400 rounded-full shadow-sm"></div>
        </div>
      </div>
    </header>
  );
}