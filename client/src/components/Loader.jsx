export default function Loader({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 16 }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{text}</p>
    </div>
  );
}
