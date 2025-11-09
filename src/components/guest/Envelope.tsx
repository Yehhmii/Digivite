"use client";
import React, { useState } from "react";

interface EnvelopeProps {
  guestName?: string;
  onOpen?: () => void;
}

export default function Envelope({ guestName = "Beloved Guest", onOpen }: EnvelopeProps) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((s) => !s);
    if (!open && onOpen) onOpen();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-72 md:w-96 h-44 md:h-56">
        <div className={`absolute inset-0 rounded-xl border border-white/6 backdrop-blur-md bg-white/5 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 pointer-events-none"} p-6 flex flex-col justify-between`}>
          <div>
            <h3 className="font-playfair text-xl md:text-2xl text-[#EDE7D7]">OURFOREVERBEGINS</h3>
            <p className="mt-2 text-sm md:text-base font-dm-serif text-[#DDD6C2] leading-relaxed">We would be honoured by your presence as we celebrate our union.</p>
          </div>

        </div>

        <div className="absolute inset-0 rounded-xl border border-white/8 overflow-hidden shadow-2xl bg-gradient-to-br from-black/40 via-black/25 to-transparent">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-gradient-to-tr from-white/6 to-transparent opacity-10 transform rotate-12 blur-xl" />
          </div>

          <button
            aria-label="Open envelope"
            onClick={toggle}
            className={`absolute left-1/2 -translate-x-1/2 top-0 w-full h-1/2 rounded-t-xl overflow-hidden flex items-center justify-center transition-transform duration-700 origin-top ${open ? "-translate-y-10 -rotate-[160deg]" : "rotate-0"}`}
            style={{ transformOrigin: "center top" }}
          >
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#6B0F1A] via-[#4C0710] to-transparent rounded-t-xl border-b border-white/6">
              <span className="text-sm md:text-base text-[#FFF8EA] font-dm-serif">{open ? "Closing..." : "Reveal"}</span>
            </div>
          </button>

          <div className="absolute left-0 right-0 bottom-0 h-1/2 flex items-center justify-center">
            <div className="w-11/12 h-[70%] rounded-lg bg-gradient-to-b from-black/10 to-black/5 border border-white/6 flex items-center justify-center">
              <div className="text-center px-4">
                <p className="mt-2 text-xs text-[#D1A85A]">{guestName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <div className="w-4 h-4 rounded-full bg-[#D4AF37] opacity-85" />
        <div className="w-3 h-5 rounded-md bg-[#6B0F1A] opacity-70 rotate-12" />
        <div className="w-5 h-2 rounded-full bg-[#D4AF37] opacity-60" />
      </div>
    </div>
  );
}
