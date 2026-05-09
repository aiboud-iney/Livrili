export default function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Page not found</h2>
      <p style={{ color: '#666', marginBottom: 20 }}>
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          display: 'inline-block',
        }}
      >
        Go home
      </a>
    </div>
  )
}
