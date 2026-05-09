'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Post } from '../../../lib/Admin_types'

interface PostCardProps {
  post: Post
  onDelete: (id: string) => void
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const router = useRouter()
  const typeColor = post.type === 'Shipment' ? '#7C3AED' : '#B8FF00'
  const typeTextColor = post.type === 'Shipment' ? '#fff' : '#111'

  const handleDetails = () => {
    const route = post.type === 'Shipment' ? '/shipment-listing' : '/route-listing'
    router.push(`${route}/${post.id}`)
  }

  return (
    <>
      {}
      <div
        className="hidden md:flex"
        style={{
          backgroundColor: '#fff',
          border: '1.5px solid #e5e7eb',
          borderRadius: '14px',
          padding: '18px 24px',
          alignItems: 'center',
          position: 'relative',
          transition: 'box-shadow 0.2s, border-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.10)'
          e.currentTarget.style.borderColor = '#c4b5fd'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.borderColor = '#e5e7eb'
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            fontSize: '11px',
            color: '#9ca3af',
            fontWeight: 500,
          }}
        >
          {post.date}
        </span>

        {}
        <div
          style={{
            minWidth: '200px',
            paddingRight: '24px',
            borderRight: '1px solid #f0f0f0',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              backgroundColor: typeColor,
              color: typeTextColor,
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.8px',
              padding: '3px 10px',
              borderRadius: '999px',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            {post.type}
          </span>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#111',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={post.title}
          >
            {post.title}
          </div>
        </div>

        {}
        <div
          style={{
            minWidth: '140px',
            padding: '0 16px',
            borderRight: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              border: '1.5px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="4.5" r="2.5" stroke="#9ca3af" strokeWidth="1.3" />
              <path
                d="M1.5 11.5a5 5 0 0110 0"
                stroke="#9ca3af"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {post.author}
          </span>
        </div>

        {}
        <div
          style={{
            minWidth: '130px',
            padding: '0 16px',
            borderRight: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            lineHeight: '20px',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2.5" width="12" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.4" />
            <path d="M1 6h12" stroke="#9ca3af" strokeWidth="1.4" />
            <path d="M4.5 1v3M9.5 1v3" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', lineHeight: 1, display: 'flex', alignItems: 'center' }}>
            {post.date}
          </span>
        </div>

        {}
        <div style={{ marginLeft: 'auto', paddingLeft: '16px', display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1.5px solid #7C3AED',
              borderRadius: '8px',
              padding: '7px 14px',
              background: '#7C3AED',
              fontSize: '12px',
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
            onClick={handleDetails}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6d28d9'
              e.currentTarget.style.background = '#6d28d9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#7C3AED'
              e.currentTarget.style.background = '#7C3AED'
            }}
          >
            Details
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M2 9L9 2M9 2H4M9 2v5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1.5px solid #fee2e2',
              borderRadius: '8px',
              padding: '7px 14px',
              background: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              color: '#ef4444',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
            onClick={() => onDelete(post.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#dc2626'
              e.currentTarget.style.background = '#fecaca'
              e.currentTarget.style.color = '#dc2626'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#fee2e2'
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.color = '#ef4444'
            }}
          >
            <Trash2 size={14} strokeWidth={2.5} />
            Delete
          </button>
        </div>
      </div>

      {}
      <div
        className="flex md:hidden flex-col"
        style={{
          backgroundColor: '#fff',
          border: '1.5px solid #e5e7eb',
          borderRadius: '14px',
          padding: '16px',
        }}
      >
        {}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              backgroundColor: typeColor,
              color: typeTextColor,
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.8px',
              padding: '3px 10px',
              borderRadius: '999px',
              textTransform: 'uppercase',
            }}
          >
            {post.type}
          </span>
          <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
            {post.date}
          </span>
        </div>

        {}
        <div
          style={{
            fontSize: '17px',
            fontWeight: 800,
            color: '#111',
            marginBottom: '14px',
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </div>

        {}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              border: '1.5px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="4.5" r="2.5" stroke="#9ca3af" strokeWidth="1.3" />
              <path
                d="M1.5 11.5a5 5 0 0110 0"
                stroke="#9ca3af"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
            {post.author}
          </span>
        </div>

        {}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #f0f0f0',
            paddingTop: '12px',
            gap: '6px',
          }}
        >
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1.5px solid #7C3AED',
              borderRadius: '8px',
              padding: '6px 10px',
              background: '#7C3AED',
              fontSize: '11px',
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              flex: 1,
            }}
            onClick={handleDetails}
          >
            Details
            <svg width="9" height="9" viewBox="0 0 11 11" fill="none">
              <path
                d="M2 9L9 2M9 2H4M9 2v5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1.5px solid #fee2e2',
              borderRadius: '8px',
              padding: '6px 10px',
              background: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              color: '#ef4444',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
            onClick={() => onDelete(post.id)}
          >
            <Trash2 size={14} strokeWidth={2.5} />
            Delete
          </button>
        </div>
      </div>
    </>
  )
}
