"use client";
import React, { useState, useEffect } from 'react';
import 'animate.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AttendanceModal from './AttendanceModal';
import NotAttendingModal from './NotAttendingModal';

const InvitationCard = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

  return (
    <div className={`${isVisible ? 'animate__animated animate__fadeInLeft animate__delay-1s' : 'opacity-0'}`}>
      <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-2xl border border-amber-200 overflow-hidden">
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
        <div className="w-full h-96 bg-gradient-to-br from-cream to-amber-50 p-6 hidden flex-col justify-center items-center text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-amber-900 mb-4">{`You're Invited!`}</h3>
            <div className="w-16 h-0.5 bg-[#D3AF37] mx-auto mb-4"></div>
            <p className="text-amber-800 font-serif leading-relaxed">
              Join us for a special celebration filled with joy, laughter, and unforgettable moments.
            </p>
            <div className="space-y-2 text-amber-700 font-serif text-sm">
              <p><strong>Date:</strong> [20th]</p>
              <p><strong>Time:</strong> [10am]</p>
              <p><strong>Venue:</strong> [Event Location]</p>
            </div>
            <div className="pt-4">
              <span className="text-[#D3AF37] text-xl">♦ ♦ ♦</span>
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header eventTitle={eventTitle} />
      
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-8">
          
          {/* Personalized greeting */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-amber-900 font-light leading-tight">
              {guestName ? (
                <>Dear <span className="text-[#D3AF37] font-medium">{guestName}</span></>
              ) : (
                'Dear Valued Guest'
              )}
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
          </div>

          {/* Invitation Card */}
          <div className="">
            <InvitationCard />
          </div>

          {/* RSVP Buttons */}
          <div className="space-y-6">
            <p className="text-lg text-amber-800 font-serif mb-6">
              Please let us know if you can attend
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Attending Button */}
              <button
                onClick={openAttendanceModal}
                className="group bg-[#D3AF37] hover:bg-amber-600 text-white px-8 py-4 rounded-full font-serif text-lg tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden min-w-[200px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <span className="text-xl">✓</span>
                  {`I'll be there`}
                </span>
              </button>

              {/* Not Attending Button */}
              <button
                onClick={openNotAttendingModal}
                className="group bg-[#722F37] hover:bg-amber-700 text-white px-8 py-4 rounded-full font-serif text-lg tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden min-w-[200px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <span className="text-xl">✗</span>
                  {`Can't make it`}
                </span>
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="opacity-30">
            <div className="flex justify-center items-center gap-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-300"></div>
              <span className="text-amber-500 text-lg animate-pulse">❦</span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-300"></div>
            </div>
          </div>
        </div>
      </main>

      <Footer 
        message="We eagerly await your response"
        tagline="Your presence would be appreciated"
      />

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
    </div>
  );
}