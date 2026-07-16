'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // Use hard redirect to guarantee middleware and cookies sync perfectly on Vercel
      window.location.href = '/admin';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      <div className="glass-card" style={{
        padding: '40px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--clr-text)', marginBottom: '8px' }}>
            Login Admin
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--clr-text-muted)' }}>
            Website Desa Negeri Pandan
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--clr-text-secondary)' }}>
              Email
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--clr-border)',
                backgroundColor: 'var(--clr-surface)',
                color: 'var(--clr-text)',
                outline: 'none',
                transition: 'var(--transition)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--clr-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
              placeholder="admin@desa.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--clr-text-secondary)' }}>
              Password
            </label>
            <input 
              id="password" 
              name="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--clr-border)',
                backgroundColor: 'var(--clr-surface)',
                color: 'var(--clr-text)',
                outline: 'none',
                transition: 'var(--transition)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--clr-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px', borderRadius: '8px' }}>
              Error: {errorMsg === 'Invalid login credentials' ? 'Email atau password salah.' : errorMsg}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}
