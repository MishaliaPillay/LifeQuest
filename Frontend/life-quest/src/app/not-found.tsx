
'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right, #F23D5E, #D9328E, #BF3FB7)',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
        Uh oh! This page got lost in the glow 🌈
      </p>
      <button
        onClick={() => router.push('/')}
        style={{
          backgroundColor: '#FFFFFF',
          color: '#F23D5E',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '9999px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#FB765C';
          e.currentTarget.style.color = '#FFF';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#FFF';
          e.currentTarget.style.color = '#F23D5E';
        }}
      >
        🏠 Take me home
      </button>
    </div>
  );
}
