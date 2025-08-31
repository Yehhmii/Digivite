// app/admin/status/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Gift = {
  id: string;
  amount?: number | null;
  note?: string | null;
  createdAt: string;
};

type GuestShort = {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  numberOfGuests?: number;
  tableNumber?: number | null;
  checkedIn?: boolean;
  checkInTime?: string | null;
  status?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  gifts?: Gift[];
};

export default function StatusPage() {
  const { status } = useSession();
  const router = useRouter();

  const [counts, setCounts] = useState({ PENDING: 0, ACCEPTED: 0, DECLINED: 0 });
  const [guestsByStatus, setGuestsByStatus] = useState<{ [k: string]: GuestShort[] }>({
    PENDING: [],
    ACCEPTED: [],
    DECLINED: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expanded, setExpanded] = useState<{ [k: string]: boolean }>({
    PENDING: false,
    ACCEPTED: false,
    DECLINED: false
  });
  const [selected, setSelected] = useState<GuestShort | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetchStatus();
  }, [status]);

  async function fetchStatus() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/status', { credentials: 'include' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to load status');
      }
      const data = await res.json();
      setCounts(data.counts || { PENDING: 0, ACCEPTED: 0, DECLINED: 0 });
      setGuestsByStatus({
        PENDING: data.guestsByStatus?.PENDING || [],
        ACCEPTED: data.guestsByStatus?.ACCEPTED || [],
        DECLINED: data.guestsByStatus?.DECLINED || []
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        console.error("Unexpected error:", err);
        setError("Failed to load status data");
      }
    } finally {
      setLoading(false);
    }
  }

  function formatDateTime(value?: string | null) {
    if (!value) return '—';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString();
  }

  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
      {children}
    </span>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h1 className="text-xl sm:text-2xl font-semibold">Guest Status</h1>
          <div className="flex items-center gap-2">
            <button onClick={fetchStatus} className="px-3 py-2 bg-emerald-700 text-white border rounded shadow-sm text-sm">Refresh</button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border text-red-700 rounded">{error}</div>
        )}

        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading status…</div>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatusCard
                title="Pending"
                count={counts.PENDING}
                color="amber"
                onToggle={() => setExpanded((s) => ({ ...s, PENDING: !s.PENDING }))}
                expanded={expanded.PENDING}
              />
              <StatusCard
                title="Accepted"
                count={counts.ACCEPTED}
                color="green"
                onToggle={() => setExpanded((s) => ({ ...s, ACCEPTED: !s.ACCEPTED }))}
                expanded={expanded.ACCEPTED}
              />
              <StatusCard
                title="Declined"
                count={counts.DECLINED}
                color="red"
                onToggle={() => setExpanded((s) => ({ ...s, DECLINED: !s.DECLINED }))}
                expanded={expanded.DECLINED}
              />
            </div>

            {/* Lists */}
            <div className="space-y-4">
              {(['PENDING', 'ACCEPTED', 'DECLINED'] as const).map((statusKey) => (
                <div key={statusKey} className="bg-white border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-gray-800">{statusKey}</h3>
                      <Badge>{(guestsByStatus[statusKey] || []).length} shown</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpanded((s) => ({ ...s, [statusKey]: !s[statusKey] }))}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        {expanded[statusKey] ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                  </div>

                  {expanded[statusKey] && (
                    <div className="mt-3 space-y-2">
                      {(guestsByStatus[statusKey] || []).map((g: GuestShort) => (
                        <button
                          key={g.id}
                          onClick={() => setSelected(g)}
                          className="w-full text-left flex items-center justify-between p-2 rounded hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-medium">
                              {g.fullName.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{g.fullName}</div>
                              <div className="text-xs text-gray-500 truncate">{g.email ?? g.phone ?? '—'}</div>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500">
                            Table {g.tableNumber ?? '—'}
                          </div>
                        </button>
                      ))}

                      {(!guestsByStatus[statusKey] || guestsByStatus[statusKey].length === 0) && (
                        <div className="p-3 text-sm text-gray-500">No guests in this category.</div>
                      )}

                      {(guestsByStatus[statusKey] || []).map((g: GuestShort) => (
                        <div key={g.id} className="w-full p-2 rounded bg-white">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0">
                              <div className="text-sm font-medium">{g.fullName}</div>
                              <div className="text-xs text-gray-500">{g.email ?? g.phone ?? '—'}</div>
                            </div>
                            <div className="text-xs text-gray-500">Table {g.tableNumber ?? '—'}</div>
                          </div>

                          {/* gifts */}
                          {g.gifts && g.gifts.length > 0 && (
                            <div className="mt-2 text-sm text-gray-700 bg-yellow-50 p-2 rounded">
                              <div className="font-semibold text-xs">Gift(s):</div>
                              {g.gifts.map((gift) => (
                                <div key={gift.id} className="text-xs">
                                  {gift.amount ? `₦${gift.amount} ` : ''}{gift.note ? `— ${gift.note}` : ''} <span className="text-gray-400 text-[11px]">({new Date(gift.createdAt).toLocaleString()})</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Selected guest modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{selected.fullName}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-800">Close</button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div><strong>Email:</strong> {selected.email ?? '—'}</div>
              <div><strong>Phone:</strong> {selected.phone ?? '—'}</div>
              <div><strong>Party size:</strong> {selected.numberOfGuests ?? 1}</div>
              <div><strong>Table:</strong> {selected.tableNumber ?? '—'}</div>
              <div><strong>Status:</strong> {selected.status}</div>
              <div><strong>Checked in:</strong> {formatDateTime(selected.checkInTime)}</div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* small StatusCard component */
function StatusCard({ title, count, color, onToggle, expanded }:
  { title: string; count: number; color: 'green'|'red'|'amber'; onToggle: () => void; expanded: boolean }) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-700'
  };
  return (
    <div className={`p-4 border rounded-lg ${colorMap[color]} flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase">{title}</div>
          <div className="mt-2 text-2xl font-bold">{count}</div>
        </div>
        <div>
          <button onClick={onToggle} className="px-2 py-1 border rounded text-sm">
            {expanded ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-600">Guests in this category</div>
    </div>
  );
}
