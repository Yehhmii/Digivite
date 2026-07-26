'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import GuestListModal from '@/components/admin/GuestListModal';
import { 
  UserPlus, 
  User, 
  Copy, 
  Check, 
  ExternalLink, 
  Users, 
  Sparkles, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Info,
  ArrowRight
} from 'lucide-react';

export default function CreateGuestPage() {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedSlug, setGeneratedSlug] = useState<string | null>(null);
  const [showGuestList, setShowGuestList] = useState(false);
  const [copied, setCopied] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  const EVENT_ID = "M'J Forever25";

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-600 font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          <span>Loading guest management...</span>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/admin/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setGeneratedSlug(null);
    setCopied(false);

    try {
      const response = await fetch('/api/admin/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ fullName, eventId: EVENT_ID })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(data.error || 'Failed to create guest');
      }

      const { guest } = await response.json();
      setSuccess(`Guest "${guest.fullName || fullName}" created successfully!`);
      setGeneratedSlug(guest.slug);
      setFullName('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        console.error("Unexpected error:", err);
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const invitationUrl = generatedSlug ? `${window.location.origin}/guest/${generatedSlug}` : '';

  const handleCopy = async () => {
    if (!generatedSlug) return;
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed', err);
      setError('Failed to copy link to clipboard');
    }
  };

  const openGuestPage = () => {
    if (!generatedSlug) return;
    window.open(`/guest/${generatedSlug}`, '_blank');
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-600 font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Guest Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Event Guest
          </h1>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 shrink-0">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Event: {EVENT_ID}</span>
        </div>
      </div>

      {/* Main Creation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-4 border border-slate-200/80 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Add New Guest</h2>
              <p className="text-xs text-slate-500">Generate a unique RSVP pass & invitation link</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Guest Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-[80%] pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                placeholder="e.g. Mr. John & Jane Doe"
                required
              />
            </div>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-[80%] flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Guest Pass...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Guest & Generate Link</span>
              </>
            )}
          </button>
        </form>

        {/* Generated Link Result */}
        {generatedSlug && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Invitation Link Ready
              </span>
              <span className="text-[11px] font-medium text-slate-400">Slug: {generatedSlug}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                readOnly
                value={invitationUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-700 outline-none select-all"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                    copied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={openGuestPage}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Page</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How It Works & Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Instructions Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Workflow Guide</span>
          </div>

          <ol className="space-y-3">
            {[
              "Enter guest's full name above.",
              "Click 'Create Guest & Generate Link'.",
              "Copy or test the unique invitation URL.",
              "Send link to guest via WhatsApp or Email."
            ].map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[11px] shrink-0">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Existing Guests Action Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-indigo-300 flex items-center justify-center backdrop-blur-md border border-white/10">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Manage Existing Guests</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Review full list of created guests, check statuses, assign tables, and generate QR passes.
            </p>
          </div>

          <button
            onClick={() => setShowGuestList(true)}
            className="w-[90%] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>View All Created Guests</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guest List Modal */}
      <GuestListModal
        isOpen={showGuestList}
        onClose={() => setShowGuestList(false)}
        eventId={EVENT_ID}
      />
    </div>
  );
}
