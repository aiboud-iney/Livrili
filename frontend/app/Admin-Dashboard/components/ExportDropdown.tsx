'use client'

import { useState, useRef, useEffect } from 'react'

type ExportType = 'shipments' | 'routes' | 'trucks' | 'subscriptions' | 'audit-logs'

const EXPORT_OPTIONS: { label: string; value: ExportType; filename: string }[] = [
  { label: 'Shipments', value: 'shipments', filename: 'shipments_export.xlsx' },
  { label: 'Routes',    value: 'routes',    filename: 'routes_export.xlsx'    },
  { label: 'Trucks',   value: 'trucks',    filename: 'trucks_export.xlsx'    },
  { label: 'Subscriptions', value: 'subscriptions', filename: 'subscriptions_export.xlsx' },
  { label: 'Audit Logs', value: 'audit-logs', filename: 'audit_logs_export.xlsx' },
]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ExportDropdown() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<ExportType | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = async (option: typeof EXPORT_OPTIONS[number]) => {
    if (loading) return
    setLoading(option.value)
    setOpen(false)
    try {
      const token =
        localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/export/${option.value}`, {
        method: 'GET',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      if (!response.ok) throw new Error(`Export failed (${response.status})`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = option.filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export error:', err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        disabled={loading !== null}
        className="h-9 px-4 text-[13px] font-semibold rounded-md bg-[#7E52FF] text-white border border-[#7E52FF] flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#6B42E8] transition-colors"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Exporting…
          </>
        ) : (
          <>
            Export
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 6px)',
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            minWidth: '160px',
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          {EXPORT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleExport(option)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#202020',
                transition: 'background 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f3ff')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <svg
                style={{ width: '14px', height: '14px', color: '#7E52FF', flexShrink: 0 }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
