'use client';
import React from 'react';

export default function AnimatedButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="btn-primary"
      type="button"
      aria-label={typeof children === 'string' ? children : 'Open invite'}
    >
      <span>{children}</span>
      <span className="accent" aria-hidden />
    </button>
  );
}
