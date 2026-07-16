import Link from 'next/link';

export default function DataTable({ 
  title, 
  addAction, 
  columns, 
  data, 
  loading, 
  onDelete 
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <div>
          <div className="section-label">Panel Data</div>
          <h1 className="section-title">
            {title.split(' ').map((word, i, arr) => 
              i === arr.length - 1 ? <span key={i} className="accent">{word}</span> : <span key={i}>{word} </span>
            )}
          </h1>
        </div>
        
        {addAction && (
          <Link href={addAction.href} className="btn btn-primary">
            {addAction.label}
          </Link>
        )}
      </div>

      <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--clr-surface-active)', borderBottom: '1px solid var(--clr-border)' }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-small)', ...col.style }}>
                  {col.label}
                </th>
              ))}
              {onDelete && (
                <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-small)', textAlign: 'right' }}>
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (onDelete ? 1 : 0)} style={{ padding: '40px', textAlign: 'center', color: 'var(--clr-text-muted)' }}>
                  <div className="orb orb-green" style={{ width: '40px', height: '40px', margin: '0 auto', animation: 'pulse-dot 2s infinite' }}></div>
                  <p style={{ marginTop: '10px' }}>Memuat data...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onDelete ? 1 : 0)} style={{ padding: '40px', textAlign: 'center', color: 'var(--clr-text-muted)' }}>
                  Belum ada data.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--clr-border)', transition: 'var(--transition)' }}>
                  {columns.map((col, idx) => (
                    <td key={idx} style={{ padding: '16px 24px', color: 'var(--clr-text)', fontSize: 'var(--fs-body)' }}>
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {onDelete && (
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="btn btn-outline"
                        style={{ padding: '8px 16px', fontSize: 'var(--fs-xs)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}
                      >
                        Hapus
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
