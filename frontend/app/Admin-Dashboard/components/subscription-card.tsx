'use client'

interface Props {
  label: string
  value: number | string
  icon: string
}

export default function SubscriptionCard({ label, value, icon }: Props) {
  return (
    <div
      style={{
        backgroundColor: '#AAFF00',
        borderRadius: 16,
        padding: '28px 32px',
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3a5200' }}>
          {label}
        </span>
        <img src={icon} alt={label} style={{ width: 22, height: 22, objectFit: 'contain', opacity: 0.7 }} />
      </div>
      <span style={{ fontSize: 48, fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  )
}