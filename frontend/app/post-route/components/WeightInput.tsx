type Props = {
  label:    string
  hint:     string
  value:    string
  onChange: (val: string) => void
  id?:      string
  name?:    string
}

export function WeightInput({ label, hint, value, onChange, id, name }: Props) {
  const inputId = id || `weight-input-${Math.random().toString(36).substr(2, 9)}`
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <label htmlFor={inputId} className="block text-sm font-bold text-gray-900 mb-1">{label}</label>
      <p className="text-xs text-gray-400 mb-2" style={{ flexGrow: 1 }}>{hint}</p>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          id={inputId}
          name={name || inputId}
          type="number"
          title={label}
          placeholder="0"
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label={label}
          style={{
            width: "100%", padding: "12px 44px 12px 16px",
            backgroundColor: "#EDFFD0", borderRadius: "8px",
            border: "none", outline: "none", fontSize: "14px", color: "#374151",
            boxSizing: "border-box", appearance: "none",
          } as React.CSSProperties}
        />
        <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "2px" }}>
          <button type="button" onClick={() => onChange(String(Number(value) + 1))} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", lineHeight: 0 }}>
            <img src="/icons/icon up green 2.png" alt="increase" width={14} height={14} style={{ display: "block", objectFit: "contain" }} />
          </button>
          <button type="button" onClick={() => onChange(String(Math.max(0, Number(value) - 1)))} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", lineHeight: 0 }}>
            <img src="/icons/icon down green 2.png" alt="decrease" width={14} height={14} style={{ display: "block", objectFit: "contain" }} />
          </button>
        </div>
      </div>
    </div>
  )
}
