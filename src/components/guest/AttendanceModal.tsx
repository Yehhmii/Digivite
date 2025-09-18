"use client";
import React, { useRef, useState } from 'react';
import { GiGlassCelebration } from "react-icons/gi";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

export default function AttendanceModal({ isOpen, onClose, slug }: AttendanceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError(null);
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          email,
          phone,
          // numberOfGuests,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to confirm. Try again later.');
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);

      setTimeout(() => {
        setSent(false);
        onClose();
      }, 4500);
    } catch (e: any) {
      setError(e?.message || 'Network error');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate__animated animate__fadeIn">
      <div 
        ref={modalRef}
        className="bg-gradient-to-br overflow-y-auto from-black/70 to-[#722F37]/20 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl shadow-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate__animated animate__zoomIn modal-luxury"
      >
        <div className="">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-start mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-playfair text-[#D4AF37] font-light leading-tight flex-1 pr-4">
                We're Excited!
              </h3>
              <button
                onClick={onClose}
                className="text-[#D4AF37] hover:text-white text-2xl sm:text-3xl font-light transition-colors duration-300 flex-shrink-0"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            
            {!sent ? (
              <>
                <div className="text-center mb-6 sm:mb-8">
                  <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 text-[#D4AF37]">
                    <GiGlassCelebration className='mx-auto'/>
                  </div>
                  <p className="text-white/90 font-dm-serif leading-relaxed text-sm sm:text-base">
                    Fill your contact details to receive your QR code, that will be used for verification.
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[#D4AF37] font-dm-serif text-xs sm:text-sm mb-2 tracking-wide">
                      Email Address
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-[80%] p-3 sm:p-4 bg-[#1a1a1a] border-2 border-[#D4AF37]/30 rounded-none font-dm-serif text-white placeholder-white/50 focus:outline-none focus:border-[#D4AF37] transition-all duration-300 newspaper-input text-sm sm:text-base"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[#D4AF37] font-dm-serif text-xs sm:text-sm mb-2 tracking-wide">
                      Phone Number
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-[80%] p-3 sm:p-4 bg-[#1a1a1a] border-2 border-[#D4AF37]/30 rounded-none font-dm-serif text-white placeholder-white/50 focus:outline-none focus:border-[#D4AF37] transition-all duration-300 newspaper-input text-sm sm:text-base"
                      type="tel"
                      placeholder="08158..."
                    />
                  </div>

                  {/* Number of Guests */}
                  {/* <div>
                    <label className="block text-[#D4AF37] font-dm-serif text-xs sm:text-sm mb-2 tracking-wide">
                      Number of Guests (including you)
                    </label>
                    <select
                      value={numberOfGuests}
                      onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                      className="w-[60%] p-3 sm:p-4 bg-[#1a1a1a] border-2 border-[#D4AF37]/30 rounded-none font-dm-serif text-amber-400 focus:outline-none focus:border-[#D4AF37] transition-all duration-300 newspaper-input text-sm sm:text-base"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div> */}

                  {error && (
                    <div className="text-xs sm:text-sm text-red-400 font-dm-serif bg-red-900/20 p-2 sm:p-3 rounded border border-red-500/30 break-words">
                      {error}
                    </div>
                  )}

                  <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button
                      onClick={onClose}
                      className="luxury-button-secondary w-[50%] sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-transparent border-2 border-white/30 text-white/80 font-dm-serif text-xs sm:text-sm tracking-[0.1em] uppercase transition-all duration-500 hover:text-white hover:border-white/60"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      type="button"
                      disabled={loading}
                      className="luxury-button-primary w-[50%] sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-dm-serif text-xs sm:text-sm tracking-[0.1em] uppercase transition-all duration-500 hover:text-black disabled:opacity-50 overflow-hidden relative group"
                    >
                      <div className="absolute inset-0 bg-[#D4AF37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                      <span className="relative z-10">
                        {loading ? 'Sending...' : 'Confirm Attendance'}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 text-[#D4AF37] animate-bounce">✓</div>
                <h4 className="text-lg sm:text-xl lg:text-2xl font-playfair text-[#D4AF37] mb-3 sm:mb-4 font-light">
                  Invitation Sent
                </h4>
                <p className="text-white/90 font-dm-serif mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base px-2">
                  An email has been sent to <span className="text-[#D4AF37] font-semibold break-words">{email}</span>. 
                  Present this QR on the day for verification — we can't wait to see you!
                </p>
                <div className="flex justify-center">
                  <button 
                    onClick={() => { setSent(false); onClose(); }} 
                    className="luxury-button-primary w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-transparent border-2 border-[#722F37] text-[#722F37] font-dm-serif text-xs sm:text-sm tracking-[0.1em] uppercase transition-all duration-500 hover:text-white overflow-hidden relative group"
                  >
                    <div className="absolute inset-0 bg-[#722F37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                    <span className="relative z-10">Close</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-luxury {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(212, 175, 55, 0.1);
        }
        
        .newspaper-input {
          background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
          box-shadow: inset 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 5px rgba(255,255,255,0.02);
          font-family: 'Times New Roman', serif;
          letter-spacing: 0.5px;
          border-style: solid;
          background-image: 
            linear-gradient(transparent 0px, transparent 24px, rgba(212, 175, 55, 0.1) 25px, rgba(212, 175, 55, 0.1) 26px, transparent 27px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.05) 0px, transparent 1px);
          background-size: 100% 27px, 27px 100%;
        }
        
        .newspaper-input:focus {
          background-image: 
            linear-gradient(transparent 0px, transparent 24px, rgba(212, 175, 55, 0.2) 25px, rgba(212, 175, 55, 0.2) 26px, transparent 27px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.1) 0px, transparent 1px);
          box-shadow: inset 2px 2px 8px rgba(0,0,0,0.6), inset -2px -2px 8px rgba(212, 175, 55, 0.05), 0 0 20px rgba(212, 175, 55, 0.1);
        }
        
        .luxury-button-primary:hover .absolute {
          transform: translateX(0);
        }
        
        .luxury-button-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        /* Responsive typography adjustments */
        @media (max-width: 640px) {
          .newspaper-input {
            background-size: 100% 22px, 22px 100%;
            background-image: 
              linear-gradient(transparent 0px, transparent 19px, rgba(212, 175, 55, 0.1) 20px, rgba(212, 175, 55, 0.1) 21px, transparent 22px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.05) 0px, transparent 1px);
          }
          
          .newspaper-input:focus {
            background-image: 
              linear-gradient(transparent 0px, transparent 19px, rgba(212, 175, 55, 0.2) 20px, rgba(212, 175, 55, 0.2) 21px, transparent 22px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.1) 0px, transparent 1px);
          }
        }
      `}</style>
    </div>
  );
}