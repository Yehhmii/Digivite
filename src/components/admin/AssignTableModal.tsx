'use client';

import React, { useEffect, useState } from 'react';

type TableItem = {
  id: string;
  number: number;
  capacity: number;
  seatsUsed: number; // computed server-side
};

export default function AssignTableModal({
  guest,
  onClose,
  onAssigned
}: {
  guest: any;
  onClose: () => void;
  onAssigned: (guest: any) => void;
}) {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(guest.tableId ?? null);
  const [checkedIn, setCheckedIn] = useState<boolean>(guest.checkedIn ?? false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState('8');

  useEffect(() => {
    fetchTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTable = async () => {
    setLoading(true);
    try {
        const payload: any = { eventId: guest.eventId, capacity: Number(newTableCapacity || 8) };
        if (newTableNumber && Number(newTableNumber) > 0) payload.number = Number(newTableNumber);
        const res = await fetch('/api/admin/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Create failed');
        await fetchTables();
        setNewTableNumber('');
        setNewTableCapacity('8');
    } catch (err: any) {
        setError(err.message || 'Create failed');
    } finally {
        setLoading(false);
    }
  };

  // fetchTables: sort by number asc for safety
  const fetchTables = async () => {
    setLoading(true);
    try {
        const res = await fetch(`/api/admin/tables?eventId=${encodeURIComponent(guest.eventId)}`, {
        credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to load tables');
        const data = await res.json();
        const sorted = (data.tables || []).sort((a: TableItem, b: TableItem) => a.number - b.number);
        setTables(sorted);
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch tables');
    } finally {
        setLoading(false);
    }
  };

    // handleSubmit: update UI using returned guest + table info
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    if (!selectedTable) {
        setError('Please select a table');
        return;
    }

    setLoading(true);
    try {
        const res = await fetch('/api/admin/assign-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            guestId: guest.id,
            tableId: selectedTable,
            checkedIn
        })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to assign table');

        setSuccess('Assigned successfully');
        // data.guest is updated guest; data.table contains occupancy info
        onAssigned(data.guest);

        // update local tables list seatsUsed using returned table info
        if (data.table) {
        setTables((prev) =>
            prev.map((t) => (t.id === data.table.id ? { ...t, seatsUsed: data.table.seatsUsed } : t))
        );
        }
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Assignment failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
        <h3 className="text-lg font-semibold mb-4">Assign table for {guest.fullName}</h3>

        {loading && <div className="text-sm text-gray-500 mb-2">Loading...</div>}

        {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
        {success && (
            <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span>{success}</span>
            </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Checked in</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCheckedIn(true)}
                className={`px-3 py-1 rounded ${checkedIn ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              >
                Yes
              </button>
              <button
                onClick={() => setCheckedIn(false)}
                className={`px-3 py-1 rounded ${!checkedIn ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              >
                No
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select table</label>
            <div className="space-y-2 max-h-48 overflow-auto">
              {tables.map((t) => {
                const seatsLeft = Math.max(0, t.capacity - (t.seatsUsed ?? 0));
                const disabled = seatsLeft < (guest.numberOfGuests ?? 1);
                return (
                  <div key={t.id} className={`p-2 border rounded flex justify-between items-center ${disabled ? 'opacity-50' : ''}`}>
                    <div>
                      <div className="font-medium">Table {t.number}</div>
                      <div className="text-sm text-gray-500">{t.seatsUsed}/{t.capacity} occupied</div>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="table"
                        checked={selectedTable === t.id}
                        onChange={() => setSelectedTable(t.id)}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                );
              })}
              {tables.length === 0 && <div className="text-sm text-gray-500">No tables found for this event.</div>}
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 border rounded">Back</button>
            <button onClick={handleSubmit} disabled={loading || !!success} className="px-4 py-2 bg-indigo-600 text-white rounded">
              {loading ? 'Saving...' : success ? 'Assigned' : 'Submit'}
            </button>
          </div>


        </div>

        {tables && (
        <div className="space-y-2 mt-3">
            <div className="text-sm text-gray-500">Create more tables for this event.</div>
            <div className="flex items-center space-x-2">
            <input
                type="number"
                min={1}
                placeholder="Table #"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                className="p-2 border rounded w-24"
            />
            <input
                type="number"
                min={1}
                placeholder="Capacity"
                value={newTableCapacity}
                onChange={(e) => setNewTableCapacity(e.target.value)}
                className="p-2 border rounded w-24"
            />
            <button onClick={createTable} className="px-3 py-2 bg-indigo-600 text-white rounded">
                Create
            </button>
            </div>
        </div>
        )}
      </div>
      

    </div>
  );
}
