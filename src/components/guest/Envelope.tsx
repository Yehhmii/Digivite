'use client';
import React, { useState, useEffect } from 'react';

interface EnvelopeProps {
  ariaLabel?: string;
}

export default function Envelope({ ariaLabel = 'Invitation envelope' }: EnvelopeProps) {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFloating(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center relative">
      <div className={`relative w-80 h-52 cursor-pointer transition-all duration-500 ease-out hover:transform hover:scale-105 hover:-translate-y-2 ${
        isFloating ? 'animate-float' : ''
      }`}>
        
        {/* Multi-layer shadow for bubble effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-orange-100/20 to-amber-200/30 rounded-full blur-xl transform translate-y-4 scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-800/10 via-orange-800/5 to-amber-900/10 rounded-full blur-lg transform translate-y-2 scale-105"></div>
        
        <svg
          className="w-full h-full relative z-10 drop-shadow-lg"
          viewBox="0 0 400 260"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={ariaLabel}
        >
          <defs>
            {/* Gradients for elegant styling */}
            <linearGradient id="envelopeBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fefefe" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f8f8f8" />
            </linearGradient>
            
            <linearGradient id="envelopeFlap" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="30%" stopColor="#b8860b" />
              <stop offset="70%" stopColor="#daa520" />
              <stop offset="100%" stopColor="#cd853f" />
            </linearGradient>

            <linearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="50%" stopColor="#ffed4a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Shadow filter */}
            <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#d4af37" floodOpacity="0.2"/>
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#b8860b" floodOpacity="0.1"/>
            </filter>
          </defs>

          {/* Main envelope body */}
          <rect 
            x="40" 
            y="80" 
            width="320" 
            height="160" 
            rx="8" 
            ry="8" 
            fill="url(#envelopeBody)" 
            stroke="#e5e5e5" 
            strokeWidth="1"
            filter="url(#dropShadow)"
            className="transition-all duration-300 hover:brightness-105"
          />

          {/* Envelope back flap (creates the envelope look) */}
          <path 
            d="M40 80 L200 160 L360 80 L360 90 L200 170 L40 90 Z" 
            fill="#f3f3f3" 
            stroke="#e0e0e0" 
            strokeWidth="1"
            opacity="0.8"
          />

          {/* Envelope fold lines for realism */}
          <path 
            d="M60 100 L200 180 L340 100" 
            stroke="#f0f0f0" 
            strokeWidth="2" 
            fill="none" 
            opacity="0.6"
          />
          <path 
            d="M80 110 L200 165 L320 110" 
            stroke="#f8f8f8" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.8"
          />

          {/* Decorative border on envelope body */}
          <rect 
            x="50" 
            y="90" 
            width="300" 
            height="140" 
            rx="4" 
            ry="4" 
            fill="none" 
            stroke="#f0f0f0" 
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity="0.5"
          />

          {/* Wax seal in center */}
          <g transform="translate(200,150)" className="transition-transform duration-300 hover:scale-110">
            <circle r="20" fill="url(#sealGradient)" opacity="0.95" />
            <circle r="18" fill="none" stroke="#b8860b" strokeWidth="1" opacity="0.7" />
            <circle r="15" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.5" />
            
            {/* Elegant symbol in seal */}
            <text 
              x="0" 
              y="6" 
              textAnchor="middle" 
              fontSize="16" 
              fontFamily="serif" 
              fill="#8b4513"
              fontWeight="bold"
            >
              ♦
            </text>
            
            {/* Small decorative dots */}
            <circle cx="0" cy="-12" r="1" fill="#b8860b" opacity="0.6" />
            <circle cx="8" cy="-8" r="1" fill="#b8860b" opacity="0.6" />
            <circle cx="-8" cy="-8" r="1" fill="#b8860b" opacity="0.6" />
            <circle cx="10" cy="4" r="1" fill="#b8860b" opacity="0.6" />
            <circle cx="-10" cy="4" r="1" fill="#b8860b" opacity="0.6" />
          </g>

          {/* Corner decorative elements */}
          <g opacity="0.3">
            <path d="M60 100 L70 95 L75 105" stroke="#d4af37" strokeWidth="1" fill="none" />
            <path d="M320 100 L330 95 L335 105" stroke="#d4af37" strokeWidth="1" fill="none" />
            <path d="M60 220 L70 225 L75 215" stroke="#d4af37" strokeWidth="1" fill="none" />
            <path d="M320 220 L330 225 L335 215" stroke="#d4af37" strokeWidth="1" fill="none" />
          </g>
        </svg>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/0 via-amber-200/0 to-orange-200/0 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}