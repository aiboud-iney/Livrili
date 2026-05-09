"use client"

interface Props {
  label: string
  hint: string
  value: string
  onChange: (val: string) => void
}

export default function WeightInput({ label, hint, value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label className="block text-sm font-bold text-gray-900 mb-1">{label}</label>
      <p className="text-xs text-gray-400 mb-2">{hint}</p>
      <div style={{ position: 'relative', width: '100%', flex: 1 }}>
        <input
          type="number"
          title={label}
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={0}
          style={{
            width: '100%',
            padding: '12px 44px 12px 16px',
            backgroundColor: '#F3EAFF',
            borderRadius: '8px',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: '#374151',
            boxSizing: 'border-box',
            appearance: 'none',
            MozAppearance: 'textfield',
          } as React.CSSProperties}
        />
        <div style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          <button
            type="button"
            onClick={() => onChange(String(Number(value) + 1))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', lineHeight: 0 }}
          >
            <img src="/icons/icon up 2.png" alt="increase" width={14} height={14} style={{ display: 'block', objectFit: 'contain' }} />
          </button>
          <button
            type="button"
            onClick={() => onChange(String(Math.max(0, Number(value) - 1)))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', lineHeight: 0 }}
          >
            <img src="/icons/icon down 2.png" alt="decrease" width={14} height={14} style={{ display: 'block', objectFit: 'contain' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
