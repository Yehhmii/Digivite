'use client';

import React, { useEffect, useState } from 'react';

type TableItem = {
  id: string;
  number: number;
  capacity: number;
  seatsUsed: number;
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
  const [numberOfGuests, setNumberOfGuests] = useState<number>(guest.numberOfGuests ?? 1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState('10');
  const [showCreateTable, setShowCreateTable] = useState(false);

  useEffect(() => {
    fetchTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTable = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: any = { 
        eventId: guest.eventId, 
        capacity: Number(newTableCapacity || 10) 
      };
      if (newTableNumber && Number(newTableNumber) > 0) {
        payload.number = Number(newTableNumber);
      }
      
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
      setNewTableCapacity('10');
      setShowCreateTable(false);
    } catch (err: any) {
      setError(err.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    
    if (!selectedTable) {
      setError('Please select a table');
      return;
    }

    if (numberOfGuests < 1) {
      setError('Number of guests must be at least 1');
      return;
    }

    setLoading(true);
    try {
      // First update the guest's numberOfGuests
      const updateRes = await fetch('/api/admin/guest/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          guestId: guest.id,
          numberOfGuests
        })
      });

      if (!updateRes.ok) {
        const data = await updateRes.json();
        throw new Error(data.error || 'Failed to update guest');
      }

      // Then assign table
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
      onAssigned(data.guest);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[100vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Assign Table</h3>
              <p className="text-sm text-indigo-100 mt-1">{guest.fullName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
          {/* Status Messages */}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading...</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Number of Guests */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Number of Guests
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                disabled={numberOfGuests <= 1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <input
                type="number"
                min={1}
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(Math.max(1, Number(e.target.value)))}
                className="w-20 text-center text-lg font-semibold py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
              <button
                onClick={() => setNumberOfGuests(numberOfGuests + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <span className="text-sm text-gray-600 ml-2">guest(s)</span>
            </div>
          </div>

          {/* Check-in Status */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Check-in Status
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setCheckedIn(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  checkedIn
                    ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-500'
                }`}
              >
                Checked In
              </button>
              <button
                onClick={() => setCheckedIn(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  !checkedIn
                    ? 'bg-gray-600 text-white shadow-lg shadow-gray-200'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-500'
                }`}
              >
                Not Checked In
              </button>
            </div>
          </div>

          {/* Select Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Select Table
              </label>
              <button
                onClick={() => setShowCreateTable(!showCreateTable)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {showCreateTable ? '- Cancel' : '+ Create Table'}
              </button>
            </div>

            {showCreateTable && (
              <div className="mb-4 p-3 sm:p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="number"
                    min={1}
                    placeholder="Table #"
                    value={newTableNumber}
                    onChange={(e) => setNewTableNumber(e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-base"
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Capacity"
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-base"
                  />
                  <button
                    onClick={createTable}
                    disabled={loading}
                    className="w-[90%] sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-64 overflow-y-auto border-2 border-gray-200 rounded-xl p-2">
              {tables.map((t) => {
                const seatsLeft = Math.max(0, t.capacity - (t.seatsUsed ?? 0));
                const disabled = seatsLeft < numberOfGuests;
                const isSelected = selectedTable === t.id;
                
                return (
                  <label
                    key={t.id}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
                      disabled
                        ? 'opacity-40 cursor-not-allowed bg-gray-100'
                        : isSelected
                        ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md'
                        : 'bg-white border-2 border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="radio"
                        name="table"
                        checked={isSelected}
                        onChange={() => !disabled && setSelectedTable(t.id)}
                        disabled={disabled}
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">Table {t.number}</div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {t.seatsUsed}/{t.capacity} seats occupied
                          {disabled && <span className="text-red-600 ml-1">(Full)</span>}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium mt-2 sm:mt-0 ml-8 sm:ml-0 ${disabled ? 'text-red-600' : 'text-green-600'}`}>
                      {seatsLeft} left
                    </div>
                  </label>
                );
              })}
              {tables.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tables found. Create one to get started.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !!success}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : success ? 'Assigned ✓' : 'Assign Table'}
          </button>
        </div>
      </div>
    </div>
  );
}