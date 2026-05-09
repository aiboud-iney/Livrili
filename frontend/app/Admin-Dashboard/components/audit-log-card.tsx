'use client'

import { useState } from 'react'
import type { AuditLog, AuditDecision } from '../../../lib/Admin_types'
import type { CSSProperties } from 'react'

function DecisionBadge({ decision }: { decision: AuditDecision }) {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px 9px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  }
  if (decision === 'VERIFIED')
    return <span style={{ ...base, background: '#C8FF20', color: '#3D6100' }}>Verified</span>
  if (decision === 'DELETED')
    return <span style={{ ...base, background: 'transparent', color: '#EF4444', border: '1.5px solid #EF4444' }}>Deleted</span>
  if (decision === 'BLOCKED POST')
    return <span style={{ ...base, background: '#DDD6FE', color: '#4C1D95' }}>Blocked Post</span>
  return null
}

export default function AuditLogCard({ log }: { log: AuditLog }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        background: '#fff',
        border: '1.5px solid #E5E7EB',
        borderRadius: 14,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
        width: '100%',
      }}
    >
      {}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          flexWrap: 'wrap',
        }}
      >
        <Field label="Audit Num"   value={log.auditNum}    flex="0 0 110px" />
        <Field label="Admin Name"  value={log.adminName}   flex="1 1 140px" />
        <Field label="User Account" value={log.userAccount} flex="1 1 140px" />
        <Field label="Timestamp"   value={log.timestamp}   flex="1 1 190px" />

        {}
        <div
          style={{
            flex: '0 0 140px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            padding: '11px 14px',
            borderRight: '1px solid #F0F0F4',
          }}
        >
          <span style={labelStyle}>Decision</span>
          <DecisionBadge decision={log.decision} />
        </div>

        {}
        <div
          style={{
            flex: '0 0 auto',
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            padding: '11px 14px',
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: open ? '#7C3AED' : '#6B7280',
              background: open ? '#F5F3FF' : 'none',
              border: `1.5px solid ${open ? '#7C3AED' : '#E5E7EB'}`,
              borderRadius: 8,
              padding: '5px 11px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            Details {open ? '‹' : '›'}
          </button>
        </div>
      </div>

      {}
      <div
        style={{
          maxHeight: open ? 120 : 0,
          overflow: 'hidden',
          borderTop: open ? '1px solid #F0F0F4' : '1px solid transparent',
          transition: 'max-height 0.28s ease, border-color 0.28s ease',
        }}
      >
        <p style={{ padding: '10px 16px', fontSize: 12.5, color: '#52525B', lineHeight: 1.65 }}>
          {log.details ?? 'No extra details available.'}
        </p>
      </div>
    </div>
  )
}

const labelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#A1A1AA',
}

function Field({ label, value, flex }: { label: string; value: string; flex: string }) {
  return (
    <div
      style={{
        flex,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        padding: '11px 14px',
        borderRight: '1px solid #F0F0F4',
        minWidth: 0,
      }}
    >
      <span style={labelStyle}>{label}</span>
      <span
        style={{
          fontSize: 13.5,
          fontWeight: 600,
          color: '#18181B',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </span>
    </div>
  )
}