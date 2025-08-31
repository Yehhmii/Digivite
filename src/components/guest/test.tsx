"use client";
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ eventSlug: string }> };

// Modal Component
const RSVPModal = ({ 
  isOpen, 
  onClose, 
  type 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  type: 'attending' | 'not-attending' | null;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-serif text-amber-900">
              {type === 'attending' ? 'We\'re Excited!' : 'We\'ll Miss You'}
            </h3>
            <button
              onClick={onClose}
              className="text-amber-600 hover:text-amber-800 text-2xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">
              {type === 'attending' ? '🎉' : '😢'}
            </div>
            <p className="text-amber-800 font-serif">
              {type === 'attending' 
                ? 'Thank you for confirming your attendance. We can\'t wait to celebrate with you!'
                : 'We understand you can\'t make it. You\'ll be missed at our special day.'
              }
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="bg-[#D3AF37] hover:bg-amber-600 text-white px-6 py-3 rounded-full font-serif transition-colors duration-300"
              >
                {type === 'attending' ? 'Perfect!' : 'Thank you'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Envelope and Invitation Component
const EnvelopeWithInvitation = () => {
  const [isOpened, setIsOpened] = useState(false);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const invitationRef = useRef<HTMLDivElement>(null);

  const openEnvelope = () => {
    if (isOpened) return;
    
    setIsOpened(true);

    // Animate envelope flap opening
    gsap.to(flapRef.current, {
      rotateX: -180,
      duration: 1,
      ease: "power2.out",
      transformOrigin: "bottom"
    });

    // Animate invitation card sliding up
    gsap.fromTo(invitationRef.current,
      { 
        y: 100, 
        opacity: 0,
        scale: 0.8
      },
      { 
        y: -50, 
        opacity: 1,
        scale: 1,
        duration: 1.2,
        delay: 0.5,
        ease: "power2.out"
      }
    );
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Envelope */}
      <div 
        ref={envelopeRef}
        className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={openEnvelope}
      >
        {/* Envelope body */}
        <div className="w-80 h-56 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-lg border-2 border-amber-300 relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-repeat" 
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D3AF37' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                 }}>
            </div>
          </div>
          
          {/* Wax seal */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-[#D3AF37] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">♦</span>
            </div>
          </div>
        </div>
        
        {/* Envelope flap */}
        <div 
          ref={flapRef}
          className="absolute top-0 left-0 w-80 h-32 bg-gradient-to-br from-amber-200 to-amber-300 border-2 border-amber-300 rounded-t-lg"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            transformStyle: 'preserve-3d'
          }}
        />
      </div>

      {/* Invitation Card */}
      <div 
        ref={invitationRef}
        className={`mt-8 opacity-0 ${isOpened ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="w-80 h-96 bg-white rounded-lg shadow-2xl border border-amber-200 overflow-hidden">
          {/* You can replace this with your actual invitation card image */}
          <div className="w-full h-full bg-gradient-to-br from-cream to-amber-50 p-6 flex flex-col justify-center items-center text-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-serif text-amber-900 mb-4">You're Invited!</h3>
              <div className="w-16 h-0.5 bg-[#D3AF37] mx-auto mb-4"></div>
              <p className="text-amber-800 font-serif leading-relaxed">
                Join us for a special celebration filled with joy, laughter, and unforgettable moments.
              </p>
              <div className="space-y-2 text-amber-700 font-serif text-sm">
                <p><strong>Date:</strong> [Event Date]</p>
                <p><strong>Time:</strong> [Event Time]</p>
                <p><strong>Venue:</strong> [Event Location]</p>
              </div>
              <div className="pt-4">
                <span className="text-[#D3AF37] text-xl">♦ ♦ ♦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tap instruction (only show if not opened) */}
      {!isOpened && (
        <p className="text-amber-600 font-serif text-sm mt-4 animate-pulse">
          Tap the envelope to open your invitation
        </p>
      )}
    </div>
  );
};

export default async function RSVPPage({ params }: Props) {
  // Await the params Promise
  const { eventSlug } = await params;

  // Find guest by slug
  const guest = await prisma.guest.findUnique({
    where: { slug: eventSlug },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      eventId: true,
    },
  });

  if (!guest) {
    return notFound(); // Next.js 404
  }

  const event = await prisma.event.findUnique({
    where: { id: guest.eventId },
    select: { title: true },
  });

  const eventTitle = event?.title ?? 'the event';

  return (
    <RSVPPageClient 
      guestName={guest.fullName}
      eventTitle={eventTitle}
    />
  );
}

// Client Component for interactivity
function RSVPPageClient({ 
  guestName, 
  eventTitle 
}: { 
  guestName: string | null; 
  eventTitle: string;
}) {
  const [modalType, setModalType] = useState<'attending' | 'not-attending' | null>(null);

  const openModal = (type: 'attending' | 'not-attending') => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
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

          {/* Envelope and Invitation */}
          <div className="py-8">
            <EnvelopeWithInvitation />
          </div>

          {/* RSVP Buttons */}
          <div className="space-y-6 pt-8">
            <p className="text-lg text-amber-800 font-serif mb-6">
              Please let us know if you can attend
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Attending Button */}
              <button
                onClick={() => openModal('attending')}
                className="group bg-[#D3AF37] hover:bg-amber-600 text-white px-8 py-4 rounded-full font-serif text-lg tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden min-w-[200px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <span className="text-xl">✓</span>
                  I'll be there
                </span>
              </button>

              {/* Not Attending Button */}
              <button
                onClick={() => openModal('not-attending')}
                className="group bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-serif text-lg tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden min-w-[200px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <span className="text-xl">✗</span>
                  Can't make it
                </span>
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="pt-8 opacity-30">
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

      {/* RSVP Modal */}
      <RSVPModal 
        isOpen={modalType !== null}
        onClose={closeModal}
        type={modalType}
      />
    </div>
  );
}