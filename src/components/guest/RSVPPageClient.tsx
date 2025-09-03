"use client";
import React, { useState, useEffect } from 'react';
import 'animate.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AttendanceModal from './AttendanceModal';
import NotAttendingModal from './NotAttendingModal';
import { FaClover } from "react-icons/fa6";
import { FaHeartbeat, FaHandHoldingHeart } from "react-icons/fa";
import { GiBigDiamondRing } from "react-icons/gi";

const InvitationCard = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

  return (
    <div className={`${isVisible ? 'animate__animated animate__fadeInUp animate__delay-1s' : 'opacity-0'}`}>
      <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden invitation-glow">
        <img 
          src="/invitation.png"
          alt="Invitation Card"
          className="w-full h-[500px] object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        
        {/* Fallback content if image doesn't load */}
        <div className="w-full h-96 bg-gradient-to-br from-black/80 to-[#722F37]/20 p-6 hidden flex-col justify-center items-center text-center border border-[#D4AF37]/20">
          <div className="space-y-6">
            <h3 className="text-3xl font-playfair text-[#D4AF37] mb-4">{`You're Invited!`}</h3>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-white/90 font-dm-serif leading-relaxed">
              Join us for a special celebration filled with joy, laughter, and unforgettable moments.
            </p>
            <div className="space-y-3 text-white/80 font-dm-serif text-sm">
              <p><span className="text-[#D4AF37] font-semibold">Date:</span> [20th]</p>
              <p><span className="text-[#D4AF37] font-semibold">Time:</span> [10am]</p>
              <p><span className="text-[#D4AF37] font-semibold">Venue:</span> [Event Location]</p>
            </div>
            <div className="pt-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                <div className="w-2 h-2 bg-[#722F37] rounded-full"></div>
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Client Component for interactivity
export default function RSVPPageClient({ 
  guestName, 
  eventTitle,
  slug,
}: { 
  guestName: string | null; 
  eventTitle: string;
  slug: string;
}) {
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showNotAttendingModal, setShowNotAttendingModal] = useState(false);

  const openAttendanceModal = () => {
    setShowAttendanceModal(true);
  };

  const closeAttendanceModal = () => {
    setShowAttendanceModal(false);
  };

  const openNotAttendingModal = async () => {
    // optimistic: mark declined on server, then show modal
    try {
      // show modal immediately for UX
      setShowNotAttendingModal(true);

      const res = await fetch('/api/guest/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Decline failed', data);
        // optionally show toast
      } else {
        // optionally update local UI or store that guest is declined
        console.log('Marked declined', data.guest);
      }
    } catch (err) {
      console.error('Decline request error', err);
    }
  };

  const closeNotAttendingModal = () => {
    setShowNotAttendingModal(false);
  };

  return (
    <div className="min-h-screen bg-black/80 relative overflow-hidden">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-playfair text-white/5 font-bold tracking-wider transform -rotate-12">
          M'J FOREVER
        </h1>
      </div>
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-[#722F37]/20 z-1"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header eventTitle="M'J FOREVER25" />
        
        <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center space-y-12">
            
            {/* Personalized greeting */}
            <div className="space-y-6 animate__animated animate__fadeInDown">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-white font-light leading-tight">
                {guestName ? (
                  <>Dear <span className="text-[#D4AF37] font-semibold">{guestName}</span></>
                ) : (
                  'Dear Valued Guest'
                )}
              </h1>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#D4AF37] rounded-full"></div>
              </div>
            </div>

            {/* Invitation Card */}
            <div className="flex justify-center">
              <InvitationCard />
            </div>

            {/* RSVP Buttons */}
            <div className="space-y-8">
              <p className="text-xl md:text-2xl text-white/90 font-playfair font-light">
                Please let us know if you can attend
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {/* Attending Button */}
                <button
                  onClick={openAttendanceModal}
                  className="group relative px-10 py-4 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-dm-serif text-lg tracking-[0.1em] uppercase transition-all duration-500 hover:text-black overflow-hidden min-w-[220px] luxury-button"
                >
                  <div className="absolute inset-0 bg-[#D4AF37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                  <span className="relative z-10 font-light">I'll be there</span>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-[#D4AF37]/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10"></div>
                </button>

                {/* Not Attending Button */}
                <button
                  onClick={openNotAttendingModal}
                  className="group relative px-10 py-4 bg-transparent border-2 border-[#722F37] text-[#722F37] font-dm-serif text-lg tracking-[0.1em] uppercase transition-all duration-500 hover:text-white overflow-hidden min-w-[220px] luxury-button"
                >
                  <div className="absolute inset-0 bg-[#722F37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                  <span className="relative z-10 font-light">Can't make it</span>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-[#722F37]/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10"></div>
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="relative">
              <div className="flex justify-center items-center gap-8 opacity-40">
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                <div className="w-3 h-3 bg-[#D4AF37] rounded-full animate-pulse"></div>
                <div className="w-20 h-0.5 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
              </div>
            </div>
          </div>
        </main>

        <Footer 
          message="We eagerly await your response"
          tagline="Your presence would be appreciated"
        />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 text-[#D4AF37]/30 text-3xl animate-bounce hidden md:block"><FaHeartbeat className='text-red-800 w-16 h-16'/></div>
      <div className="absolute top-32 right-16 text-[#722F37]/40 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>💕</div>
      
      <div className="absolute bottom-60 right-12 text-[#722F37]/30 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}><FaClover className='text-amber-600 w-12 h-12'/></div>
      <div className="absolute top-1/2 left-8 text-[#D4AF37]/25 text-3xl animate-bounce" style={{ animationDelay: '1.5s' }}><GiBigDiamondRing className='text-amber-200'/></div>
      <div className="absolute top-1/3 right-8 text-[#722F37]/35 text-2xl animate-pulse" style={{ animationDelay: '2.5s' }}><FaHandHoldingHeart className='text-white w-12 h-12'/></div>
            

      {/* Modals */}
      <AttendanceModal 
        isOpen={showAttendanceModal}
        onClose={closeAttendanceModal}
        slug={slug}
      />
      
      <NotAttendingModal 
        isOpen={showNotAttendingModal}
        onClose={closeNotAttendingModal}
        slug={slug}
        guestName={guestName}
      />

      {/* Custom Styles */}
      <style jsx>{`
        .invitation-glow {
          box-shadow: 0 0 50px rgba(212, 175, 55, 0.15);
        }
        
        .invitation-glow:hover {
          box-shadow: 0 0 60px rgba(212, 175, 55, 0.25);
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }
        
        .luxury-button {
          background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        
        .luxury-button:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          transform: translateY(-2px);
        }
        
        /* Animated background text */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-10px) rotate(-12deg); }
        }
        
        .background-text {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}