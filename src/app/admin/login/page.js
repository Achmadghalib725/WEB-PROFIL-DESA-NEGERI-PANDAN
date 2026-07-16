import { login } from './actions'

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const isError = params?.error === 'true'
  const errorMessage = params?.error !== 'true' ? params?.error : null;

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
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-light, #f8fafc)', marginBottom: '8px' }}>
            Login Admin
          </h1>
          <p className="text-muted" style={{ fontSize: '14px' }}>
            Website Desa Negeri Pandan
          </p>
        </div>

        <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted, #94a3b8)' }}>
              Email
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              placeholder="admin@desa.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted, #94a3b8)' }}>
              Password
            </label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              placeholder="••••••••"
            />
          </div>

          {(isError || errorMessage) && (
            <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px' }}>
              Error: {errorMessage || 'Email atau password salah.'}
            </div>
          )}

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#10b981', // emerald-500
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  )
}
