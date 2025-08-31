'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Scanner from '@/components/admin/Scanner';
import AssignTableModal from '@/components/admin/AssignTableModal'

export default function ScannerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  if (status === 'loading') return <div className="p-6">Loading...</div>;
  if (status === 'unauthenticated') {
    // redirect to admin login if not authenticated
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Scan guest to verify</h1>
        <p className="text-sm text-gray-600 mb-6">Point your camera at the guest QR code. On successful verification the guest details will populate below.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner box */}
          <div className="bg-white border rounded p-4">
            <Scanner
              onResult={(result) => {
                // result is { ok: boolean, guest?: {...}, message?: string }
                if (result && result.ok && result.guest) {
                  setSelectedGuest(result.guest);
                } else {
                  setSelectedGuest({ error: result.message || 'Not verified' });
                }
              }}
            />
          </div>

          {/* Details panel */}
          <div className="bg-white border rounded p-4">
            <h2 className="text-lg font-medium mb-2">Verified guest</h2>
            {!selectedGuest && <p className="text-sm text-gray-500">No guest scanned yet.</p>}

            {selectedGuest?.error && (
              <div className="text-red-500">{selectedGuest.error}</div>
            )}

            {selectedGuest && !selectedGuest.error && (
              <div className="space-y-2">
                <div><span className="font-medium">Name: </span>{selectedGuest.fullName}</div>
                <div><span className="font-medium">Email: </span>{selectedGuest.email ?? '—'}</div>
                <div><span className="font-medium">Phone: </span>{selectedGuest.phone ?? '—'}</div>
                <div><span className="font-medium">Status: </span>{selectedGuest.status}</div>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Assign table
                  </button>
                  <button
                    onClick={() => setSelectedGuest(null)}
                    className="px-4 py-2 border rounded"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign table modal */}
      {showAssignModal && selectedGuest && !selectedGuest.error && (
        <AssignTableModal
          guest={selectedGuest}
          onClose={() => setShowAssignModal(false)}
          onAssigned={(updatedGuest) => {
            setSelectedGuest(updatedGuest);
          }}
        />
      )}
    </div>
  );
}
