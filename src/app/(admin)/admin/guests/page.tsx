'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateGuestPage() {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedSlug, setGeneratedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  // replace with your actual event identifier (id, slug or title)
  const EVENT_ID = "M'J Forever25";

  if (status === 'loading') return <div>Loading...</div>;
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
        credentials: 'include', // ensure cookies/session are sent
        body: JSON.stringify({ fullName, eventId: EVENT_ID })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(data.error || 'Failed to create guest');
      }

      const { guest } = await response.json();
      setSuccess(`Guest created successfully!`);
      setGeneratedSlug(guest.slug);
      setFullName('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
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
      // small reset of the copied state
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed', err);
      setError('Failed to copy link to clipboard');
    }
  };

  const openGuestPage = () => {
    if (!generatedSlug) return;
    // open in a new tab
    window.open(`/guest/${generatedSlug}`, '_blank');
  };

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Guest</h1>
      <h3 className="text-lg mb-4">Event: M'J Forever25</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block mb-1 font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder='Mr John Doe'
            required
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Creating...' : 'Create Guest'}
        </button>
      </form>

      {/* Generated slug / link UI */}
      {generatedSlug && (
      <div className="mt-6 p-4 border rounded bg-white shadow-sm">
        <h4 className="font-medium mb-2">Guest link</h4>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
          <input
            readOnly
            value={`/guest/${generatedSlug}`}
            className="flex-1 p-2 border rounded bg-gray-50 w-full sm:w-auto"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 w-full sm:w-auto"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={openGuestPage}
              className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full sm:w-auto"
            >
              Open
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Full URL: <span className="break-words">{invitationUrl}</span>
        </p>
      </div>
      )}


      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">How it works</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Enter guest's full name</li>
          <li>Click "Create Guest"</li>
          <li>Copy the generated slug or open the invitation link</li>
          <li>Use the slug in your invitation URL: /guest/[slug]</li>
        </ol>
      </div>
    </div>
  )
}
