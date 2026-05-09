'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  currentPage: 'verifications' | 'audit-logs' | 'subscription' | 'posts'
  onPageChange: (page: 'verifications' | 'audit-logs' | 'subscription' | 'posts') => void
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { t } = useLang()
  const router = useRouter()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)
  const menuItems = [
  {id: 'verifications', labelKey: 'verifications', iconPath: '/icons/verification sidebar light.png',activeIconPath: '/icons/verification sidebar.png',},
  {id: 'audit-logs',labelKey: 'auditLogs', iconPath: '/icons/audit logs sidebar.png', activeIconPath: '/icons/audit logs sidebar dark.png',},
  {id: 'subscription', labelKey: 'subscription', iconPath: '/icons/SubscriptiosLight.png',activeIconPath: '/icons/SubscriptionsDark.png',},
  {id: 'posts', labelKey: 'postsManagement', iconPath: '/icons/posts-sidebar-light.svg', activeIconPath: '/icons/posts-sidebar-dark.svg',}]

  return (
    <div
      className="group relative h-full bg-[#7E52FF] text-white transition-all duration-300 ease-out flex-shrink-0"
      style={{ width: isOpen ? '240px' : '80px' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center h-20 px-4 gap-3">
          <div className="w-10 h-10 bg-[#B8FF00] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src="/icons/logo green.png" alt="Livrili Logo" className="w-8 h-8" />
          </div>
          {isOpen && (
            <span className="font-bold text-lg whitespace-nowrap text-black">Livrili</span>
          )}
        </div>

        <nav className="flex-1 px-3 py-6">
          <div
            className={`w-full flex items-center mb-4 transition-all duration-300 ${
              isOpen ? 'justify-start px-2' : 'justify-center px-0'
            }`}
          >
            <span
              className={`text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 text-white/70 ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 w-0 overflow-hidden -translate-x-2'
              }`}
            >
              Dashboard
            </span>
          </div>

          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id as any)}
                  className={`w-full flex items-center cursor-pointer gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-[#B8FF00] text-[#1a1a1a] font-semibold'
                      : 'text-white hover:bg-[#6d41ff]'
                  }`}
                  title={t(item.labelKey)}
                >
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={currentPage === item.id ? item.activeIconPath : item.iconPath}
                      alt={t(item.labelKey)}
                      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                    />
                  </div>
                  {isOpen && <span className="whitespace-nowrap text-sm">{item.id === 'verifications' ? 'Users' : t(item.labelKey)}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-3 pb-6">
          <div className="border-t border-white/20 px-0 pt-4 space-y-1 mb-3">
            <button
              onClick={() => router.push('/feedback')}
              className="w-full flex items-center cursor-pointer gap-3 px-3 py-3 rounded-lg text-white hover:bg-[#6d41ff] transition-colors duration-200"
              title={t('giveFeedback')}
            >
              <div className="w-5 h-5 flex-shrink-0">
                <img src="/icons/feedback sidebar.png" alt="Feedback" className="w-5 h-5" />
              </div>
              {isOpen && <span className="whitespace-nowrap text-sm">{t('giveFeedback')}</span>}
            </button>

            <button
              onClick={() => router.push('/help')}
              className="w-full flex items-center cursor-pointer gap-3 px-3 py-3 rounded-lg text-white hover:bg-[#6d41ff] transition-colors duration-200"
              title={t('help')}
            >
              <div className="w-5 h-5 flex-shrink-0">
                <img src="/icons/help sidebar.png" alt="Help" className="w-5 h-5" />
              </div>
              {isOpen && <span className="whitespace-nowrap text-sm">{t('help')}</span>}
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center cursor-pointer gap-3 px-3 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors duration-200"
            title={t('logout')}
          >
            <div className="w-5 h-5 flex-shrink-0">
              <img src="/icons/logout.png" alt="Logout" className="w-4 h-4" />
            </div>
            {isOpen && <span className="whitespace-nowrap text-sm">{t('logout')}</span>}
          </button>
        </div>
      </div>
    </div>
  )
}