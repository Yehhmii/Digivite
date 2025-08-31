'use client';

import React from 'react';

export default function CheckedInModal({
  guest,
  onClose
}: {
  guest: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{guest.fullName}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
        </div>

        <div className="mt-4 space-y-3 text-sm text-gray-700">
          <div><strong>Phone:</strong> {guest.phone ?? '—'}</div>
          <div><strong>Email:</strong> {guest.email ?? '—'}</div>
          <div><strong>Table:</strong> {guest.tableNumber ?? '—'}</div>
          <div><strong>Party size:</strong> {guest.numberOfGuests ?? 1}</div>
          <div><strong>Checked in:</strong> {guest.createdAt ? new Date(guest.createdAt).toLocaleString() : '—'}</div>
          <div><strong>Guest ID:</strong> <code className="text-xs text-gray-500 break-all">{guest.id}</code></div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
