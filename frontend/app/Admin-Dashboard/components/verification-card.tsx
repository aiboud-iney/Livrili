'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { VerificationRequest } from '../../../lib/Admin_types'

interface Props {
  req: VerificationRequest
  onVerify: (id: string) => void
  onDelete: (id: string) => void
  onSaveNote: (id: string, note: string) => void
}

export default function VerificationCard({
  req,
  onVerify,
  onDelete,
  onSaveNote,
}: Props) {
  const [note, setNote] = useState(req.note ?? '')
  const hasNote = note.trim().length > 0

  const handleSave = () => {
    onSaveNote(req.id, note)
  }

  return (
    <Card className="rounded-xl border-2 border-purple-300 shadow-none">
      <CardContent className="h-full p-8 pb-3 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row gap-4 mb-5">
          <div className="w-full h-[200px] sm:w-[160px] sm:h-[160px] flex-shrink-0 rounded-lg bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
            {req.userImage ? (
              <img src={req.userImage} alt={req.companyName} className="w-full h-full object-cover"/>
            ) : (
              <span className="text-[11px] text-gray-400 text-center leading-snug">
                No picture
                <br />
                uploaded
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[20px] font-bold text-gray-900 leading-tight mb-1.5">
              {req.companyName}
            </p>

            <Badge className="mb-3 bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#EDE9FE] border-0 text-[11px] font-semibold rounded-full px-3 py-0.5">
              {req.wilaya}
            </Badge>

            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-0.5">
              Trade Register Number
            </p>
            <p className="text-[18px] font-semibold text-gray-900 mb-2">
              {req.tradeRegisterNumber}
            </p>
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-0.5">
              NIF
            </p>
            <p className="text-[18px] font-semibold text-gray-900">{req.nif}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 mb-3" />

        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <span className="text-[12px] text-gray-400 font-semibold">
            {req.submittedAt}
          </span>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`w-10 h-10 flex items-center justify-center border-0 shadow-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 rounded-md transition ${
                    hasNote
                      ? 'bg-[#EDE9FE]'
                      : 'bg-transparent hover:bg-purple-50 active:bg-purple-200 active:scale-95'
                  }`}
                >
                  <img
                    src="/icons/note.png"
                    alt="Note"
                    className="w-5 h-5 object-contain"
                  />
                </button>
              </PopoverTrigger>

              <PopoverContent
                side="top"
                align="end"
                sideOffset={8}
                className="w-72 rounded-xl border border-gray-200 p-4 shadow-lg"
              >
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write a note..."
                  className="w-full min-h-[90px] rounded-lg border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="h-8 px-4 text-[13px] font-bold bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
                  >
                    Save
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              onClick={() => onDelete(req.id)}
              className="h-8 px-4 min-w-[84px] text-[13px] font-bold border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
            >
              Delete
            </Button>

            <Button
              onClick={() => onVerify(req.id)}
              className="h-8 px-4 min-w-[84px] text-[13px] font-bold bg-[#AAFF00] text-gray-900 hover:bg-[#99EE00] border-0 shadow-none"
            >
              Verify
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}