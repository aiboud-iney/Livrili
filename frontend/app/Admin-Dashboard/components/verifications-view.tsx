'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import VerificationCard from './verification-card'
import { Pagination } from './pagination'
import { API_BASE_URL, getAuthHeaders } from '@/lib/api'

const ITEMS_PER_PAGE = 6

interface UserVerification {
  id: string
  companyName: string
  wilaya: string
  tradeRegisterNumber: string
  nif: string
  userImage?: string
  submittedAt: string
  note?: string
  isVerified: boolean
  verificationStatus?: string
  email?: string
  phoneNumber?: string
  userType?: string
  activePlan?: string
  subscriptionStatus?: string
}

export default function VerificationsView() {
  const [items, setItems] = useState<UserVerification[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const USERS_API = `${API_BASE_URL}/users`;
  const BACKEND_STATIC_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${USERS_API}/getAllUsers`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error('Failed to fetch users');

        const data = await response.json();

        const mappedData: UserVerification[] = data.users.map((user: any) => {
          let imageUrl = '';
          if (user.profile_picture) {
            const fileName = user.profile_picture.split(/[\\/]/).pop();
            imageUrl = `${BACKEND_STATIC_URL}/uploads/profile-pictures/${fileName}`;
          }

          return {
            id: user.id.toString(),
            companyName: user.business_name || 'Unknown',
            wilaya: user.wilaya || user.headquarters_address || 'Unknown',
            tradeRegisterNumber: user.trade_register || 'N/A',
            nif: user.nif || user.tin_nif || 'N/A',
            userImage: imageUrl,
            submittedAt: new Date(user.created_at).toLocaleDateString(),
            note: '',
            isVerified: user.verified === true || user.verification === true,
            verificationStatus: user.verification_status || (user.verification ? 'verified' : 'not_requested'),
            email: user.email,
            phoneNumber: user.phone_number,
            userType: user.user_type,
            activePlan: user.active_plan_name,
            subscriptionStatus: user.subscription_status
          };
        });

        setItems(mappedData);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleVerify = async (id: string) => {
    try {
      const response = await fetch(`${USERS_API}/approve/${id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to approve verification');

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isVerified: true } : item
        )
      );

      toast.success("User verified successfully");
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to verify user. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`${USERS_API}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setItems((prev) => prev.filter((v) => v.id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const handleSaveNote = (id: string, note: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item))
    )
    toast.success("Note saved");
  }

  const paginated = items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  if (isLoading) return <div className="px-4 sm:px-8 pt-7 font-semibold">Loading users...</div>;
  if (error) return <div className="px-4 sm:px-8 pt-7 text-red-500 font-semibold">Error: {error}</div>;

  return (
    <div className="px-4 sm:px-8 pt-7">
      <h1 className="text-[32px] font-black text-gray-900 mb-6 tracking-tight">
        Users Management
      </h1>

      {items.length === 0 ? (
        <div className="text-gray-500 text-lg py-8">No users found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            {paginated.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onVerify={handleVerify}
                onDelete={handleDelete}
                onSaveNote={handleSaveNote}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={Math.ceil(items.length / ITEMS_PER_PAGE)}
            onChange={setPage}
          />
        </>
      )}
    </div>
  )
}

interface UserCardProps {
  user: UserVerification
  onVerify: (id: string) => void
  onDelete: (id: string) => void
  onSaveNote: (id: string, note: string) => void
}

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

function UserCard({ user, onVerify, onDelete, onSaveNote }: UserCardProps) {
  const [note, setNote] = useState(user.note ?? '')
  const hasNote = note.trim().length > 0

  const handleSave = () => {
    onSaveNote(user.id, note)
  }

  return (
    <Card className={`rounded-xl border-2 shadow-none ${user.isVerified ? 'border-green-300' : 'border-purple-300'}`}>
      <CardContent className="h-full p-6 pb-3 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full h-[160px] sm:w-[120px] sm:h-[120px] flex-shrink-0 rounded-lg bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
            {user.userImage ? (
              <img src={user.userImage} alt={user.companyName} className="w-full h-full object-cover"/>
            ) : (
              <span className="text-[11px] text-gray-400 text-center leading-snug">
                No picture
                <br />
                uploaded
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[18px] font-bold text-gray-900 leading-tight">
                {user.companyName}
              </p>
              {user.isVerified ? (
                <Badge className="bg-green-100 text-green-700 border-0 text-[10px] font-semibold rounded-full px-2 py-0.5">
                   Verified
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-semibold rounded-full px-2 py-0.5">
                  Pending
                </Badge>
              )}
            </div>

            <Badge className="mb-2 bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#EDE9FE] border-0 text-[11px] font-semibold rounded-full px-3 py-0.5">
              {user.wilaya}
            </Badge>

            <div className="text-[12px] text-gray-500 mb-1">
              <span className="font-medium">Email:</span> {user.email || 'N/A'}
            </div>
            <div className="text-[12px] text-gray-500 mb-1">
              <span className="font-medium">Phone:</span> {user.phoneNumber || 'N/A'}
            </div>
            <div className="text-[12px] text-gray-500 mb-1">
              <span className="font-medium">Type:</span> {user.userType || 'user'}
            </div>
            {user.activePlan && (
              <div className="text-[12px] text-gray-500 mb-1">
                <span className="font-medium">Plan:</span>{' '}
                <Badge className={`text-[10px] px-1.5 py-0 ${user.activePlan === 'Premium' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                  {user.activePlan}
                </Badge>
              </div>
            )}

            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-0.5 mt-2">
              Trade Register
            </p>
            <p className="text-[14px] font-semibold text-gray-900 mb-1">
              {user.tradeRegisterNumber}
            </p>
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-0.5">
              NIF
            </p>
            <p className="text-[14px] font-semibold text-gray-900">{user.nif}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 mb-3" />

        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <span className="text-[12px] text-gray-400 font-semibold">
            Joined: {user.submittedAt}
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
              onClick={() => onDelete(user.id)}
              className="h-8 px-4 min-w-[84px] text-[13px] font-bold border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
            >
              Delete
            </Button>

            {!user.isVerified && (
              <Button
                onClick={() => onVerify(user.id)}
                className="h-8 px-4 min-w-[84px] text-[13px] font-bold bg-[#AAFF00] text-gray-900 hover:bg-[#99EE00] border-0 shadow-none"
              >
                Verify
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
