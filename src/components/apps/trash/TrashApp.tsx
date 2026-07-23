export default function TrashApp() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: '12px',
      color: '#888',
      fontFamily: "'Courier New', monospace",
    }}>
      <span style={{ fontSize: '32px' }}>🗑️</span>
      <p style={{ fontSize: '13px', color: '#a09888' }}>
        Trash est vide.
      </p>
      <p style={{ fontSize: '10px', color: '#555' }}>
        Certains souvenirs ne s'effacent jamais vraiment.
      </p>
    </div>
  )
}