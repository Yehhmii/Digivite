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
  const [numberOfGuests, setNumberOfGuests] = useState(1);
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
          numberOfGuests,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to confirm. Try again later.');
        setLoading(false);
        return;
      }

      // success
      setSent(true);
      setLoading(false);

      // auto-close after short delay (or leave to user to close)
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate__animated animate__fadeIn">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate__animated animate__zoomIn"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-serif text-[#1a000d]">
              We're Excited!
            </h3>
            <button
              onClick={onClose}
              className="text-amber-600 hover:text-amber-800 text-2xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          {!sent ? (
          <>
            <div className="text-center mb-4">
              <div className="text-5xl mb-2 text-amber-800">
                <GiGlassCelebration className='mx-auto'/>
              </div>
              <p className="text-amber-800 font-serif">Fill your contact details to receive your QR code, that will be used for verification.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#1a000d] font-serif text-sm mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-amber-300 rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-[#D3AF37]"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-[#1a000d] font-serif text-sm mb-1">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-amber-300 rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-[#D3AF37]"
                  type="tel"
                  placeholder="08158..."
                />
              </div>

              <div>
                <label className="block text-[#1a000d] font-serif text-sm mb-1">Number of Guests (including you)</label>
                <select
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                  className="w-[70%] md:w-full p-3 border border-amber-300 rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-[#D3AF37]"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="pt-4 flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="bg-gray-200 hover:bg-gray-300 text-[#1a000d] px-6 py-3 rounded-full font-serif transition-colors duration-300"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  type="button"
                  disabled={loading}
                  className="bg-[#D3AF37] disabled:opacity-60 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-serif transition-colors duration-300"
                >
                  {loading ? 'Sending...' : 'Confirm Attendance'}
                </button>
              </div>
            </div>
          </>
          ) : (
            // Success state
            <div className="text-center py-6">
              <div className="text-6xl mb-4 animate-bounce">✅</div>
              <h4 className="text-xl font-serif text-amber-900 mb-2">Invitation Sent</h4>
              <p className="text-amber-800 mb-4">An email has been sent to <strong>{email}</strong>. Present this QR on the day for verification — we can’t wait to see you!</p>
              <div className="flex justify-center">
                <button onClick={() => { setSent(false); onClose(); }} className="bg-[#722F37] text-white px-8 py-3 rounded-full">
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}