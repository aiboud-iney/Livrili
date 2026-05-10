'use client'

import { useState, useEffect, useMemo } from 'react'
import { Upload, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import AuditLogCard from './audit-log-card'
import { Pagination } from './pagination'
import type { AuditLog } from '../../../lib/Admin_types'
import { API_BASE_URL as API_BASE, getAuthHeaders } from '@/lib/api'

const exportFilteredLogs = (logs: AuditLog[]) => {
  const rows = logs.map(log => ({
    ID:         log.auditNum,
    Admin:      log.adminName,
    Account:    log.userAccount,
    Action:     log.decision,
    Details:    log.details || '',
    Timestamp:  log.timestamp,
  }))

  import('xlsx').then(XLSX => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, ws, 'Audit Logs')
    XLSX.writeFile(wb, 'audit_logs_export.xlsx')
  })
}

const ITEMS_PER_PAGE = 8
const ADMIN_ACTIONS = ['All', 'VERIFIED', 'DELETED', 'BLOCKED POST']

export default function AuditLogsView() {
  const [items, setItems] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [adminName, setAdminName] = useState('All')
  const [adminAction, setAdminAction] = useState('All')

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`${API_BASE}/audit-logs?limit=200`, {
          headers: getAuthHeaders(),
        })
        if (!res.ok) throw new Error('Failed to fetch audit logs')
        const data = await res.json()
        setItems(data.logs || [])
      } catch (err: any) {
        console.error('Audit log fetch error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const adminNames = useMemo(() => {
    const unique = Array.from(new Set(items.map((log) => log.adminName)))
    return ['All', ...unique]
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((log) => {
      const matchesName   = adminName   === 'All' || log.adminName === adminName
      const matchesAction = adminAction === 'All' || log.decision  === adminAction
      return matchesName && matchesAction
    })
  }, [items, adminName, adminAction])

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  if (isLoading) return <div className="px-4 sm:px-8 pt-7 font-semibold">Loading audit logs...</div>
  if (error)     return <div className="px-4 sm:px-8 pt-7 text-red-500 font-semibold">Error: {error}</div>

  return (
    <div className="px-4 sm:px-8 pt-7">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-[32px] font-black text-gray-900 tracking-tight">
          Audit Log
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 px-4 gap-2 text-[13px] font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 min-w-[140px] justify-between flex items-center">
              {adminName === 'All' ? 'Admin Name' : adminName}
              <ChevronDown size={14} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl min-w-[140px]">
              {adminNames.map((name) => (
                <DropdownMenuItem
                  key={name}
                  onClick={() => { setAdminName(name); setPage(1) }}
                  className="text-[13px]"
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 px-4 gap-2 text-[13px] font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 min-w-[150px] justify-between flex items-center">
              {adminAction === 'All' ? 'Admin Action' : adminAction}
              <ChevronDown size={14} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl min-w-[150px]">
              {ADMIN_ACTIONS.map((action) => (
                <DropdownMenuItem
                  key={action}
                  onClick={() => { setAdminAction(action); setPage(1) }}
                  className="text-[13px]"
                >
                  {action}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="h-10 px-5 gap-2 text-[13px] font-bold rounded-xl border-0"
            style={{ backgroundColor: '#111827', color: '#AAFF00' }}
            onClick={() => exportFilteredLogs(filtered)}
          >
            <Upload size={14} strokeWidth={2.5} />
            Export Logs
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-gray-500 text-lg py-8">No audit logs found.</div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {paginated.map((log) => (
              <AuditLogCard key={log.id} log={log} />
            ))}
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
              onChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  )
}
