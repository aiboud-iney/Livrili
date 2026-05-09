'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLang } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import type { AdminPage } from '../../../lib/Admin_types'

interface Props {
  currentPage: AdminPage
  onPageChange: (p: AdminPage) => void
}

const menuItems = [
  { id: 'verifications', labelKey: 'verifications', iconPath: '/icons/verification sidebar light.png', activeIconPath: '/icons/verification sidebar.png' },
  { id: 'audit-logs', labelKey: 'auditLogs', iconPath: '/icons/audit logs sidebar.png', activeIconPath: '/icons/audit logs sidebar dark.png' },
{id: 'Subscription', labelKey: 'Subscription', iconPath: '/icons/SubscriptiosLight.png',activeIconPath: '/icons/SubscriptionsDark.png',},
  { id: 'posts', labelKey: 'postsManagement', iconPath: '/icons/posts-sidebar-light.svg', activeIconPath: '/icons/posts-sidebar-dark.svg' }]

export default function AdminSidebarMobile({ currentPage, onPageChange }: Props) {
  const { t } = useLang()
  const router = useRouter()
  const { logout } = useAuth()

  return (
    <div
      className="flex flex-col items-center py-3 gap-3 bg-[#7E52FF]"
      style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 44, zIndex: 30 }}
    >
      {}
      <div className="w-7 h-7 bg-[#B8FF00] rounded-md flex items-center justify-center mb-2 flex-shrink-0 overflow-hidden">
        <img src="/icons/logo green.png" alt="Livrili Logo" className="w-5 h-5 object-contain" />
      </div>

      {}
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(item.id as AdminPage)}
          title={item.id === 'verifications' ? 'Users' : t(item.labelKey)}
          className={`w-8 h-8 rounded-lg p-0 transition-all ${
            currentPage === item.id
              ? 'bg-[#B8FF00] hover:bg-[#B8FF00]'
              : 'hover:bg-[#6d41ff]'
          }`}
        >
          <img
            src={currentPage === item.id ? item.activeIconPath : item.iconPath}
            alt={item.id === 'verifications' ? 'Users' : t(item.labelKey)}
            className="w-5 h-5 object-contain"
          />
        </Button>
      ))}

      {}
      <div className="mt-auto pb-2 flex flex-col gap-1 items-center">
        <div className="border-t border-white/20 w-full mb-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/feedback')}
          title={t('giveFeedback')}
          className="w-8 h-8 rounded-lg p-0 hover:bg-[#6d41ff]"
        >
          <img src="/icons/feedback sidebar.png" alt="Feedback" className="w-5 h-5 object-contain" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/help')}
          title={t('help')}
          className="w-8 h-8 rounded-lg p-0 hover:bg-[#6d41ff]"
        >
          <img src="/icons/help sidebar.png" alt="Help" className="w-5 h-5 object-contain" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          title={t('logout')}
          className="w-8 h-8 rounded-full border border-white/30 p-0 hover:bg-white/10 mt-1"
        >
          <img src="/icons/logout.png" alt="Logout" className="w-4 h-4 object-contain" />
        </Button>
      </div>
    </div>
  )
}