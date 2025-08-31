export async function signOut() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Logout failed' }));
    throw new Error(body?.message || 'Logout failed');
  }

  return res.json();
}
