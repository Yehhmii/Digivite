'use client';

import React from 'react';
import type { Guest } from '../../app/admin/checkedIn/page';

export default function CheckedInList({
  guests,
  loading,
  onSelect
}: {
  guests: Guest[];
  loading?: boolean;
  onSelect?: (g: Guest) => void;
}) {
  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  if (!guests || guests.length === 0) {
    return <div className="p-6 text-center text-gray-600">No guests have checked in yet with .</div>;
  }

  return (
    <div className="space-y-2">
      {guests.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelect?.(g)}
          className="w-[90%] text-left flex items-center justify-between bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-medium">
              {g.fullName.split(' ').map((s) => s[0]).slice(0,2).join('').toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{g.fullName}</div>
              <div className="text-xs text-gray-500 truncate">
                {g.phone ?? '—'} • Table {g.tableNumber ?? '—'}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            {g.createdAt ? new Date(g.createdAt).toLocaleString() : ''}
          </div>
        </button>
      ))}
    </div>
  );
}
