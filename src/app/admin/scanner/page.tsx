'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Scanner from '@/components/admin/Scanner';
import AssignTableModal from '@/components/admin/AssignTableModal';
import { 
  QrCode, 
  ShieldCheck, 
  UserCheck, 
  User, 
  Mail, 
  Phone, 
  Table, 
  RotateCcw, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  ScanLine,
  Sparkles
} from 'lucide-react';

export default function ScannerPage() {
  type Guest = {
    id?: string;
    type: 'guest';
    fullName: string;
    email?: string;
    phone?: string;
    status: string;
    tableId?: string;
    checkedIn?: boolean;
    eventId?: string;
  };

  type GuestError = {
    type: 'error';
    error: string;
  };

  type GuestResult = Guest | GuestError | null;

  const { status } = useSession();
  const router = useRouter();

  const [selectedGuest, setSelectedGuest] = useState<GuestResult>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [verifying, setVerifying] = useState(false);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-600 font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          <span>Loading verification portal...</span>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Entrance Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <QrCode className="w-7 h-7 text-indigo-600" />
            <span>QR Verification Gate</span>
          </h1>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Gate Scanner Ready</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Camera Scanner */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ScanLine className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Live Camera Scanner</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Automatic Capture</span>
          </div>

          <Scanner
            onResult={(result: { ok: boolean; guest?: Omit<Guest, 'type'>; message?: string }) => {
              if (result.message === 'Verifying QR pass...') {
                setVerifying(true);
                return;
              }
              setVerifying(false);
              if (result && result.ok && result.guest) {
                setSelectedGuest({ type: 'guest', ...result.guest });
              } else {
                setSelectedGuest({ type: 'error', error: result.message || 'Verification failed' });
              }
            }}
          />

          <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            Position the guest&apos;s digital or printed QR pass in front of the camera lens. Results update automatically upon scan.
          </p>
        </div>

        {/* Right Column: Verification Results */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xl space-y-5 min-h-[420px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-800">Verification Result</h2>
              </div>
              {selectedGuest && (
                <button
                  onClick={() => setSelectedGuest(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Clear result"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Verifying Loader */}
            {verifying && (
              <div className="p-8 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center text-center gap-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="text-sm font-semibold text-indigo-900">Checking Pass in Database...</span>
              </div>
            )}

            {/* Idle Empty State */}
            {!verifying && !selectedGuest && (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-xs">
                  <QrCode className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-700">Awaiting QR Scan</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Scan a guest pass on the left to view guest details and assign seating.
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {!verifying && selectedGuest?.type === 'error' && (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-700">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>Pass Verification Rejected</span>
                </div>
                <p className="text-xs text-rose-600 font-medium pl-7">
                  {selectedGuest.error}
                </p>
              </div>
            )}

            {/* Verified Guest Card */}
            {!verifying && selectedGuest?.type === 'guest' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Verified Guest</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider">
                    {selectedGuest.status || 'Verified'}
                  </span>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                  <div className="flex items-center gap-3 text-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Name</span>
                      <span className="font-bold text-sm text-slate-900">{selectedGuest.fullName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                      <span className="font-medium text-slate-700">{selectedGuest.email || 'Not specified'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
                      <span className="font-medium text-slate-700">{selectedGuest.phone || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!verifying && selectedGuest?.type === 'guest' && (
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setShowAssignModal(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <Table className="w-4 h-4" />
                <span>Assign Table</span>
              </button>

              <button
                onClick={() => setSelectedGuest(null)}
                className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Assign Table Modal */}
      {showAssignModal && selectedGuest?.type === 'guest' && (
        <AssignTableModal
          guest={selectedGuest}
          onClose={() => setShowAssignModal(false)}
          onAssigned={(updatedGuest) => {
            setSelectedGuest({ type: 'guest', ...updatedGuest });
          }}
        />
      )}
    </div>
  );
}
