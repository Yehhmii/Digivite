'use client';
import React, { useEffect, useState } from 'react';

type Guest = {
  id: string;
  fullName?: string | null;
  slug?: string | null;
  email?: string | null;
  phone?: string | null;
  createdAt?: string | null;
};

export default function GuestListModal({
  isOpen,
  onClose,
  eventId,
}: {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;

    async function fetchGuests() {
      setLoading(true);
      setError(null);
      try {
        const url = new URL('/api/admin/guest', window.location.origin);
        if (eventId) url.searchParams.set('eventId', eventId);

        const res = await fetch(url.toString());
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || 'Failed to fetch guests');
        }
        const data = await res.json();
        if (!mounted) return;
        setGuests(data.guests ?? []);
      } catch (err: any) {
        console.error('fetchGuests error', err);
        if (!mounted) return;
        setError(err?.message || 'Error fetching guests');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchGuests();
    return () => {
      mounted = false;
    };
  }, [isOpen, eventId]);

  const filtered = guests.filter((g) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (g.fullName ?? '').toLowerCase().includes(q) ||
      (g.slug ?? '').toLowerCase().includes(q) ||
      (g.email ?? '').toLowerCase().includes(q)
    );
  });

  const copyToClipboard = async (slug?: string | null) => {
    if (!slug) return;
    const url = `${window.location.origin}/guest/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    } catch (err) {
      console.error('copy failed', err);
      setError('Failed to copy link');
    }
  };

  const openGuest = (slug?: string | null) => {
    if (!slug) return;
    window.open(`/guest/${slug}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-auto z-10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Created Guests</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-600 px-2">✕</button>
        </div>

        <div className="mb-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, slug or email..."
            className="w-[90%] p-2 border rounded-md"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-600">Error: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No guests found.</div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((g) => (
              <li key={g.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{g.fullName ?? '(No name)'}</div>
                  <div className="text-xs text-gray-500 truncate">{g.email ?? g.phone ?? ''}</div>
                  <div className="text-xs mt-1 text-gray-400 truncate">/{`guest/${g.slug}`}</div>
                </div>

                <div className="ml-3 flex gap-2 items-center">
                  <button
                    onClick={() => copyToClipboard(g.slug)}
                    className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                    title="Copy invitation link"
                  >
                    {copiedSlug === g.slug ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    onClick={() => openGuest(g.slug)}
                    className="px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-sm text-white"
                    title="Open guest page"
                  >
                    Open
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200">Close</button>
        </div>
      </div>
    </div>
  );
}
