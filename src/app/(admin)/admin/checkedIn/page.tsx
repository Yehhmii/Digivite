'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CheckedInList from '@/components/admin/CheckedInList';
import CheckedInModal from '@/components/admin/CheckedInModal';

export type Guest = {
  id: string;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  numberOfGuests?: number;
  tableNumber?: number | null;
  createdAt?: string | null;
  tableId?: string | null;
};

export default function CheckedInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [field, setField] = useState<'all' | 'name' | 'email' | 'table'>('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);

  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Debounce query -> use a debouncedQuery that updates 400ms after user stops typing
  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setPage(1); // reset page when search changes
  }, [debouncedQuery, field, status]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, field, page, status]);

  async function fetchGuests() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set('q', debouncedQuery);
      if (field) params.set('field', field);
      params.set('page', String(page));
      params.set('limit', String(limit));

      const res = await fetch(`/api/admin/checked-in?${params.toString()}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to load guests');
      }
      const data = await res.json();
      setGuests(data.guests || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load guests');
      setGuests([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  const pageCount = useMemo(() => Math.ceil((total || 0) / limit) || 1, [total, limit]);

return (
    <div className="min-h-screen p-3 sm:p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header + Search (mobile-first, stacks) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 items-start">
          {/* Title */}
          <div className="col-span-1 sm:col-span-1">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-800">Checked-in Guests</h1>
          </div>

          {/* Search controls: occupies two cols on desktop, full width stacked on mobile */}
          <div className="col-span-1 sm:col-span-2">
            <div className="bg-white border rounded-md p-3 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value as any)}
                  className="w-full sm:w-40 p-2 border rounded bg-white text-sm"
                  aria-label="Search field"
                >
                  <option value="all">All</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="table">Table #</option>
                </select>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, email or table..."
                  className="w-full p-2 border rounded text-sm"
                  type="search"
                  aria-label="Search guests"
                />

                {/* Clear button - small on desktop, full width on mobile */}
                <button
                  onClick={() => { setQuery(''); setField('all'); }}
                  className="mt-2 sm:mt-0 w-full sm:w-auto px-3 py-2 bg-white border rounded text-sm shadow-sm hover:bg-gray-50"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              </div>

              {/* optional: show helper or loading indicator */}
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div>{loading ? 'Searching...' : `Showing ${guests.length} results`}</div>
                <div className="hidden sm:block">Tip: search by name, email or table #</div>
              </div>
            </div>
          </div>
        </div>

        {/* error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* list */}
        <div className="mb-4">
          <CheckedInList guests={guests} onSelect={(g) => setSelectedGuest(g)} loading={loading} />
        </div>

        {/* pagination - mobile stacks, desktop inline */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600">Showing {guests.length} of {total} results</div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-2 bg-white border rounded text-sm disabled:opacity-50"
              aria-label="Previous page"
            >
              Prev
            </button>

            <div className="px-3 py-2 text-sm text-gray-700 border rounded">
              {page} / {pageCount}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page >= pageCount}
              className="px-3 py-2 bg-white border rounded text-sm disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* guest modal */}
      {selectedGuest && (
        <CheckedInModal guest={selectedGuest} onClose={() => setSelectedGuest(null)} />
      )}
    </div>
  );

}

/* helper: debounce hook */
function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
