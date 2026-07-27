'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Keamanan Lockout
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Keamanan Captcha
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');

  useEffect(() => {
    // Generate initial captcha
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);

    // Cek status lockout di localStorage
    const savedLockout = localStorage.getItem('adminLockout');
    if (savedLockout) {
      const lockoutExpiry = parseInt(savedLockout, 10);
      if (Date.now() < lockoutExpiry) {
        setLockoutTime(lockoutExpiry);
      } else {
        localStorage.removeItem('adminLockout');
        localStorage.removeItem('adminFailedAttempts');
      }
    } else {
      const savedAttempts = parseInt(localStorage.getItem('adminFailedAttempts') || '0', 10);
      setFailedAttempts(savedAttempts);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (lockoutTime) {
      interval = setInterval(() => {
        const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
        if (remaining <= 0) {
          setLockoutTime(null);
          setFailedAttempts(0);
          localStorage.removeItem('adminLockout');
          localStorage.removeItem('adminFailedAttempts');
          clearInterval(interval);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (lockoutTime) {
      setErrorMsg(`Akun terkunci sementara karena 3x salah password. Coba lagi dalam ${timeLeft} detik.`);
      return;
    }

    if (parseInt(captchaInput, 10) !== num1 + num2) {
      setErrorMsg('Jawaban matematika salah! Silakan coba lagi.');
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setCaptchaInput('');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('adminFailedAttempts', newAttempts.toString());
      
      if (newAttempts >= 3) {
        const expiry = Date.now() + 3 * 60 * 1000; // 3 menit
        setLockoutTime(expiry);
        localStorage.setItem('adminLockout', expiry.toString());
        setErrorMsg('Terlalu banyak percobaan gagal. Akun terkunci selama 3 menit.');
      } else {
        setErrorMsg(error.message === 'Invalid login credentials' ? `Email/Password salah. Sisa percobaan: ${3 - newAttempts}` : error.message);
      }
      
      // Reset captcha
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setCaptchaInput('');
      setLoading(false);
    } else {
      localStorage.removeItem('adminFailedAttempts');
      localStorage.removeItem('adminLockout');
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
              maxLength={50}
              disabled={!!lockoutTime}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--clr-border)',
                backgroundColor: lockoutTime ? 'rgba(255,255,255,0.05)' : 'var(--clr-surface)',
                color: lockoutTime ? 'var(--clr-text-muted)' : 'var(--clr-text)',
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
              maxLength={50}
              disabled={!!lockoutTime}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--clr-border)',
                backgroundColor: lockoutTime ? 'rgba(255,255,255,0.05)' : 'var(--clr-surface)',
                color: lockoutTime ? 'var(--clr-text-muted)' : 'var(--clr-text)',
                outline: 'none',
                transition: 'var(--transition)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--clr-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
              placeholder="••••••••"
            />
          </div>

          {!lockoutTime && (
            <div>
              <label htmlFor="captcha" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--clr-text-secondary)' }}>
                Keamanan: Berapa hasil {num1} + {num2}?
              </label>
              <input 
                id="captcha" 
                name="captcha" 
                type="number"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
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
                placeholder="Jawaban Anda..."
              />
            </div>
          )}

          {errorMsg && (
            <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px', borderRadius: '8px' }}>
              {errorMsg}
            </div>
          )}

          {lockoutTime && (
            <div style={{ color: '#eab308', fontSize: '14px', textAlign: 'center', backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '10px', borderRadius: '8px' }}>
              Membuka kunci dalam {timeLeft} detik...
            </div>
          )}

          <button 
            type="submit"
            disabled={loading || !!lockoutTime}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: (loading || !!lockoutTime) ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              opacity: (loading || !!lockoutTime) ? 0.7 : 1
            }}
          >
            {loading ? 'Memproses...' : (lockoutTime ? 'Terkunci' : 'Masuk')}
          </button>
        </form>
      </div>
    </div>
  )
}
