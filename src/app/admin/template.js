'use client';

export default function AdminTemplate({ children }) {
  return (
    <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
      {children}
    </div>
  );
}
