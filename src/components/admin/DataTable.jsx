import Link from 'next/link';

export default function DataTable({ 
  title, 
  addAction, 
  columns, 
  data, 
  loading, 
  onDelete,
  editBasePath
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--clr-primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: '30px', height: '2px', backgroundColor: 'var(--clr-primary)' }}></span>
            Panel Data
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--clr-primary)' }}></span>
          </span>
          <h1 className="section-title" style={{ margin: 0, fontSize: '32px' }}>{title}</h1>
        </div>
        {addAction && (
          <Link href={addAction.href} className="btn btn-primary" style={{ textDecoration: 'none' }}>
            {addAction.label}
          </Link>
        )}
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
            <tr style={{ backgroundColor: 'var(--clr-surface-active)', borderBottom: '1px solid var(--clr-border)' }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-small)', ...col.style }}>
                  {col.label}
                </th>
              ))}
              <th style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-small)', textAlign: 'center', width: '120px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '40px', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '40px', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>
                  Belum ada data.
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr key={rowIndex} style={{ borderBottom: '1px solid var(--clr-border)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--clr-surface)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} style={{ padding: '16px 24px', color: 'var(--clr-text-light)' }}>
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {editBasePath && (
                        <Link 
                          href={`${editBasePath}/${item.id}`}
                          style={{
                            padding: '6px 16px',
                            backgroundColor: 'rgba(234, 179, 8, 0.1)',
                            color: '#eab308',
                            border: '1px solid rgba(234, 179, 8, 0.2)',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(234, 179, 8, 0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(234, 179, 8, 0.1)'}
                        >
                          Edit
                        </Link>
                      )}
                      <button 
                        onClick={() => onDelete(item.id)}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)', // red-500 with opacity
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
