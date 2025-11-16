'use client';
import React, { useRef, useState } from 'react';
import { FaRegSadTear } from "react-icons/fa";

interface NotAttendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  guestName?: string | null;
}

export default function NotAttendingModal({ isOpen, onClose, slug, guestName }: NotAttendingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [provider, setProvider] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirmSending = async () => {
    setSending(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/guest/gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          amount: amount ? Number(amount) : undefined,
          note: note || undefined,
          provider: provider || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register gift');
      setSuccess('Thanks — your gift has been recorded.');
      setAmount('');
      setNote('');
      setProvider('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message || 'Failed to register gift');
      } else {
        console.error("Unexpected error:", err);
        setError("Something went wrong");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate__animated animate__fadeIn">
      <div 
        ref={modalRef}
        className="bg-gradient-to-br overflow-y-auto  px-9 from-black/90 to-[#722F37]/20 backdrop-blur-md border border-[#722F37]/40 rounded-xl shadow-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate__animated animate__zoomIn modal-luxury"
      >
        <div className="">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-start mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-playfair text-[#722F37] font-light leading-tight flex-1 pr-4">
                We'll Miss You{guestName ? `, ${guestName}` : ''}
              </h3>
              <button 
                onClick={onClose} 
                className="text-[#722F37] hover:text-white text-2xl sm:text-3xl font-light transition-colors duration-300 flex-shrink-0" 
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6 text-[#722F37]">
                <FaRegSadTear className='mx-auto'/>
              </div>
              
              <p className="text-white/90 font-dm-serif leading-relaxed text-sm sm:text-base">
                We understand you can't make it. You'll be missed at our special day.
              </p>
              
              <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 text-left">
                <h4 className="text-center text-[#D4AF37] font-playfair text-base sm:text-lg font-light mb-3 sm:mb-4">
                  Would you like to send a gift?
                </h4>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[#D4AF37] font-dm-serif text-xs sm:text-sm mb-2 tracking-wide">
                      Amount (optional)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 sm:p-4 bg-[#1a1a1a] border-2 border-[#722F37]/30 rounded-none font-dm-serif text-white placeholder-white/50 focus:outline-none focus:border-[#722F37] transition-all duration-300 newspaper-input text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#D4AF37] font-dm-serif text-xs sm:text-sm mb-2 tracking-wide">
                      Provider
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. bank or mobile wallet"
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full p-3 sm:p-4 bg-[#1a1a1a] border-2 border-[#722F37]/30 rounded-none font-dm-serif text-white placeholder-white/50 focus:outline-none focus:border-[#722F37] transition-all duration-300 newspaper-input text-sm sm:text-base"
                    />
                  </div>
                  
                  <div className='w-full p-3 sm:p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#D4AF37]/30 rounded-none font-dm-serif text-white newspaper-display'>
                    <h5 className="text-[#D4AF37] font-semibold mb-2 sm:mb-3 text-xs sm:text-sm tracking-wider">
                      ACCOUNT DETAILS
                    </h5>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-1">
                        <span className="text-white/70">Account Number:</span>
                        <span className="text-[#D4AF37] font-mono break-all">0053092590</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-1">
                        <span className="text-white/70">Account Name:</span>
                        <span className="text-[#D4AF37] break-words">Olajide Silva</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Account Bank:</span>
                        <span className="text-[#D4AF37] break-words">Access Bank</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-xs sm:text-sm text-red-400 font-dm-serif bg-red-900/20 p-2 sm:p-3 rounded border border-red-500/30 break-words">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-xs sm:text-sm text-green-400 font-dm-serif bg-green-900/20 p-2 sm:p-3 rounded border border-green-500/30 break-words">
                  {success}
                </div>
              )}

              <div className="pt-4 sm:pt-6 flex flex-row sm:flex-row gap-3 sm:gap-4 justify-center">
                <button 
                  onClick={onClose} 
                  className="luxury-button-secondary w-[50%] sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-transparent border-2 border-white/30 text-white/80 font-dm-serif text-xs sm:text-sm tracking-[0.1em] uppercase transition-all duration-500 hover:text-white hover:border-white/60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSending}
                  className="luxury-button-primary w-[50%] sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-transparent border-2 border-[#722F37] text-[#722F37] font-dm-serif text-xs sm:text-sm tracking-[0.1em] uppercase transition-all duration-500 hover:text-white disabled:opacity-50 overflow-hidden relative group"
                  disabled={sending}
                >
                  <div className="absolute inset-0 bg-[#722F37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                  <span className="relative z-10">
                    {sending ? 'Saving...' : 'Confirm Sending'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-luxury {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(114, 47, 55, 0.1);
        }
        
        .newspaper-input {
          background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
          box-shadow: inset 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 5px rgba(255,255,255,0.02);
          font-family: 'Times New Roman', serif;
          letter-spacing: 0.5px;
          border-style: solid;
          background-image: 
            linear-gradient(transparent 0px, transparent 24px, rgba(114, 47, 55, 0.1) 25px, rgba(114, 47, 55, 0.1) 26px, transparent 27px),
            linear-gradient(90deg, rgba(114, 47, 55, 0.05) 0px, transparent 1px);
          background-size: 100% 27px, 27px 100%;
        }
        
        .newspaper-input:focus {
          background-image: 
            linear-gradient(transparent 0px, transparent 24px, rgba(114, 47, 55, 0.2) 25px, rgba(114, 47, 55, 0.2) 26px, transparent 27px),
            linear-gradient(90deg, rgba(114, 47, 55, 0.1) 0px, transparent 1px);
          box-shadow: inset 2px 2px 8px rgba(0,0,0,0.6), inset -2px -2px 8px rgba(114, 47, 55, 0.05), 0 0 20px rgba(114, 47, 55, 0.1);
        }
        
        .newspaper-display {
          background-image: 
            linear-gradient(transparent 0px, transparent 19px, rgba(212, 175, 55, 0.1) 20px, rgba(212, 175, 55, 0.1) 21px, transparent 22px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.05) 0px, transparent 1px);
          background-size: 100% 22px, 22px 100%;
          box-shadow: inset 2px 2px 8px rgba(0,0,0,0.4), inset -2px -2px 8px rgba(212, 175, 55, 0.02);
        }
        
        .luxury-button-primary:hover .absolute {
          transform: translateX(0);
        }
        
        .luxury-button-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        /* Responsive typography adjustments */
        @media (max-width: 640px) {
          .newspaper-input, .newspaper-display {
            background-size: 100% 22px, 22px 100%;
          }
          
          .newspaper-input {
            background-image: 
              linear-gradient(transparent 0px, transparent 19px, rgba(114, 47, 55, 0.1) 20px, rgba(114, 47, 55, 0.1) 21px, transparent 22px),
              linear-gradient(90deg, rgba(114, 47, 55, 0.05) 0px, transparent 1px);
          }
          
          .newspaper-input:focus {
            background-image: 
              linear-gradient(transparent 0px, transparent 19px, rgba(114, 47, 55, 0.2) 20px, rgba(114, 47, 55, 0.2) 21px, transparent 22px),
              linear-gradient(90deg, rgba(114, 47, 55, 0.1) 0px, transparent 1px);
          }
        }
      `}</style>
    </div>
  );
}