'use client';
import React, { useRef, useState } from 'react';
import { FaRegSadTear } from "react-icons/fa";

interface NotAttendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string; // new
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
      // optionally clear form
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate__animated animate__fadeIn">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate__animated animate__zoomIn"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-serif text-[#1a000d]">{`We'll Miss You`}{guestName ? `, ${guestName}` : ''}</h3>
            <button onClick={onClose} className="text-amber-600 hover:text-amber-800 text-2xl font-bold" aria-label="Close modal">×</button>
          </div>
          
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4 text-amber-800">
              <FaRegSadTear className='mx-auto'/>
            </div>
            <p className="text-amber-800 font-serif">
              {`We understand you can't make it. You'll be missed at our special day.`}
            </p>
            
            {/* Gift form */}
            <div className="space-y-4 pt-4 text-left">
              <label className="block text-[#1a000d] font-serif text-sm mb-1">Would you like to send a gift?</label>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="number"
                  placeholder="Amount (optional)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border border-amber-300 rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-[#D3AF37]"
                />
                <input
                  type="text"
                  placeholder="Provider (e.g. bank or mobile wallet)"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full p-3 border border-amber-300 rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-[#D3AF37]"
                />
                <div className='w-full p-3 border border-amber-300 rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-[#D3AF37] resize-non'>
                      <ul>
                        <li>Account Number: <span className='text-amber-800'>2037620118</span></li>
                        <li>Account Name: <span className='text-amber-800'>Olajide Silva</span></li>
                        <li>Account Bank: <span className='text-amber-800'>Kuda Bank</span></li>
                      </ul>
                </div>
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <div className="pt-4 flex gap-3 justify-center">
              <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-amber-800 px-6 py-3 rounded-full font-serif transition-colors duration-300">Cancel</button>
              <button
                onClick={handleConfirmSending}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-serif transition-colors duration-300 disabled:opacity-60"
                disabled={sending}
              >
                {sending ? 'Saving...' : 'Confirm Sending'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
