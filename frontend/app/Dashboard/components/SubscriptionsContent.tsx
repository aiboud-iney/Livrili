'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'

type SubscriptionState = 'active' | 'expired' | 'pending' | 'free'
type VerificationStatus = 'not_requested' | 'pending' | 'verified' | 'rejected'

interface FeatureItem {
  name: string
  description: string
  icon: React.ReactNode
  locked?: boolean
}

interface SubscriptionPlan {
  status: SubscriptionState
  planName: string
  price: string
  nextBillingDate?: string
  expirationDate?: string
  features: FeatureItem[]
}

interface DbSubscription {
  id: number
  user_id: number
  plan_id: number
  start_date: string
  end_date: string
  status: string
  plan_name: string
  plan_description: string
  amount?: number
}

interface Payment {
  id: number
  date: string
  ref: string
  amount: string
  rawAmount?: number
  method: string
  status: string
  rawStatus: string
  receipt: string | null
  billing_cycle?: string
}

interface User {
  id: number
  email: string
  business_name: string
  verification_status: VerificationStatus
  verification_requested_at?: string
  verification_rejected_reason?: string
}

const Icons = {
  unlimited: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" stroke="#7E52FF" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  gps: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="#7E52FF" strokeWidth="1.5"/>
      <path d="M12 2V4M22 12H20M12 20V22M4 12H2M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M17.66 17.66L19.07 19.07M6.34 6.34L4.93 4.93" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  analytics: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 21H3V3" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 15L10 11L13 14L20 6" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  check: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  locked: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="11" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
      <path d="M8 11V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V11" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.5" fill="#9ca3af"/>
    </svg>
  ),
  limited: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#7E52FF" strokeWidth="1.5"/>
      <path d="M12 8V12L14 14" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  call: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.352 21.4019C21.1467 21.5901 20.9043 21.7335 20.6405 21.8227C20.3767 21.9119 20.0973 21.945 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49903 10.2412 2.44615 7.27184 2.12 4.18C2.09519 3.90347 2.1284 3.6248 2.21755 3.3616C2.3067 3.0984 2.44973 2.85654 2.63743 2.65152C2.82513 2.44651 3.0536 2.28296 3.30816 2.17113C3.56272 2.0593 3.83795 2.00179 4.116 2.002H7.116C7.59526 1.9979 8.05826 2.17629 8.414 2.502C8.76974 2.82771 8.98923 3.27416 9.022 3.752C9.07253 4.43434 9.18669 5.1105 9.362 5.771C9.46606 6.13993 9.4608 6.53022 9.34682 6.89593C9.23285 7.26165 9.01542 7.58504 8.722 7.825L7.418 8.879C7.20441 9.0484 7.07548 9.29891 7.06423 9.56839C7.05298 9.83786 7.1606 10.098 7.358 10.285C8.36432 11.3968 9.53904 12.3477 10.838 13.102C11.0333 13.2094 11.2538 13.2615 11.4762 13.2536C11.6986 13.2457 11.9146 13.1782 12.101 13.058L13.278 12.298C13.5498 12.115 13.8775 12.023 14.209 12.037C14.5406 12.0509 14.8589 12.1701 15.113 12.377C15.7413 12.8772 16.4235 13.3062 17.147 13.657C17.5119 13.8372 17.8111 14.118 18.001 14.464C18.191 14.8099 18.261 15.2031 18.2 15.588L17.835 18.004C17.8036 18.2434 17.7034 18.4676 17.5464 18.6521C17.3894 18.8365 17.1823 18.9738 16.951 19.048C16.6374 19.1459 16.3125 19.2038 15.984 19.22" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  email: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#7E52FF" strokeWidth="1.5"/>
      <path d="M22 7L12 13L2 7" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  card: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="#7E52FF" strokeWidth="1.5"/>
      <path d="M3 10H21" stroke="#7E52FF" strokeWidth="1.5"/>
      <path d="M7 15H10" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3V16M12 16L9 13M12 16L15 13" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 17L5 19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V17" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  help: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#7E52FF" strokeWidth="1.5"/>
      <path d="M12 16V12M12 8H12.01" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  warning: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 9V13M12 17H12.01" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 3L2 19H22L12 3Z" stroke="#DC2626" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  pending: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#D97706" strokeWidth="1.5"/>
      <path d="M12 6V12L16 14" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shieldCheck: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shieldX: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9L15 15M15 9L9 15" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-100 p-6 md:p-10">
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="h-12 bg-gray-300 rounded w-1/3"></div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="border border-gray-200 p-6 h-full">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded w-full mt-4"></div>
            </div>
          </Card>
        </div>
      </div>
      <Card className="border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="h-32 bg-gray-300 rounded w-full"></div>
        </div>
      </Card>
    </div>
  </div>
)

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="min-h-screen bg-gray-100 p-6 md:p-10 flex items-center justify-center">
    <Card className="border border-red-200 p-8 max-w-md w-full text-center">
      <div className="mb-4">
        <Icons.warning />
      </div>
      <h3 className="text-lg font-bold text-red-900 mb-2">Error Loading Data</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-[#7C3AED] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6D28D9] transition-colors"
      >
        Try Again
      </button>
    </Card>
  </div>
)

export default function SubscriptionsContent() {
  const router = useRouter()
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>('free')
  const [dbData, setDbData] = useState<DbSubscription | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || ''
  }

  const getUserId = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        return user.id
      } catch {
        return null
      }
    }
    return null
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  const fetchAllData = async () => {
    const userId = getUserId()
    if (!userId) {
      setError('User not found. Please log in again.')
      setLoading(false)
      return
    }

    const token = getAuthToken()
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

    try {
      setLoading(true)
      setError(null)

      const subsRes = await fetch(`${apiBase}/userSubs/user/${userId}`, { headers })
      if (!subsRes.ok) throw new Error('Failed to fetch subscription')
      const subsData = await subsRes.json()

      const paymentsRes = await fetch(`${apiBase}/userSubs/payments/${userId}`, { headers })
      if (!paymentsRes.ok) throw new Error('Failed to fetch payment history')
      const paymentsData = await paymentsRes.json()

      const userRes = await fetch(`${apiBase}/users/${userId}`, { headers })
      if (!userRes.ok) throw new Error('Failed to fetch user data')
      const userData = await userRes.json()

      const subscriptions: DbSubscription[] = subsData.subscriptions || []
      const premiumPlan = subscriptions.find((sub: DbSubscription) =>
        sub.plan_name &&
        (sub.plan_name.toLowerCase().includes('premium') || sub.plan_name.toLowerCase().includes('pro')) &&
        sub.status.toLowerCase() === 'active'
      ) || subscriptions.find((sub: DbSubscription) =>
        sub.plan_name &&
        (sub.plan_name.toLowerCase().includes('premium') || sub.plan_name.toLowerCase().includes('pro'))
      )

      const validStatuses: SubscriptionState[] = ['active', 'expired', 'pending', 'free']

      if (premiumPlan) {
        const dbStatus = premiumPlan.status.toLowerCase()
        setSubscriptionState(validStatuses.includes(dbStatus as SubscriptionState) ? dbStatus as SubscriptionState : 'free')
        setDbData(premiumPlan)
      } else {
        setSubscriptionState('free')
        setDbData(null)
      }

      setPayments(paymentsData.payments || [])

      setUser(userData.user || null)

    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const handleUpgrade = async (billingCycle: 'monthly' | 'yearly') => {

    const amount = billingCycle === 'yearly' ? '600000' : '60000'
    router.push(`/payment?billingCycle=${billingCycle}&amount=${amount}`)
  }

  const handleRenew = async () => {

    const isYearly = dbData?.plan_name?.toLowerCase().includes('yearly')
    const billingCycle = isYearly ? 'yearly' : 'monthly'
    const amount = isYearly ? '600000' : '60000'
    router.push(`/payment?billingCycle=${billingCycle}&amount=${amount}`)
  }

  const handleRequestVerification = async () => {
    const userId = getUserId()
    const token = getAuthToken()
    if (!userId || !token) {
      setError('Please log in to request verification')
      return
    }

    try {
      setActionLoading('verify')
      const res = await fetch(`${apiBase}/users/${userId}/request-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to request verification')
      }

      await fetchAllData()
      alert('Verification request submitted successfully!')
    } catch (err) {
      console.error('Error requesting verification:', err)
      alert(err instanceof Error ? err.message : 'Failed to request verification')
    } finally {
      setActionLoading(null)
    }
  }

  const getFeaturesForPlan = (status: SubscriptionState): FeatureItem[] => {
    const baseFeatures = [
      { name: 'Unlimited listings', description: 'Post as many shipments as needed', icon: <Icons.unlimited /> },
      { name: 'Live GPS tracking', description: 'Enhanced trust and visibility', icon: <Icons.gps /> },
      { name: 'Advanced analytics', description: 'Deep route & market insights', icon: <Icons.analytics /> },
      { name: 'Full access', description: 'To premium features', icon: <Icons.check /> },
    ]

    if (status === 'free') {
      return [
        { name: 'Limited listings', description: 'Post a few shipments', icon: <Icons.limited />, locked: false },
        { name: 'Basic tracking', description: 'Standard visibility', icon: <Icons.gps />, locked: false },
        { name: 'Limited analytics', description: 'Basic insights', icon: <Icons.analytics />, locked: true },
        { name: 'Limited access', description: 'To basic features only', icon: <Icons.check />, locked: true },
      ]
    }

    if (status === 'expired' || status === 'pending') {
      return baseFeatures.map(f => ({ ...f, locked: true }))
    }

    return baseFeatures
  }

  const formatDbDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-[#B8FF00] text-gray-900'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'expired':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getVerificationStatusDisplay = (status?: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return { icon: <Icons.shieldCheck />, text: 'Account Verified', className: 'text-green-600 bg-green-50' }
      case 'pending':
        return { icon: <Icons.pending />, text: 'Pending Verification', className: 'text-yellow-600 bg-yellow-50' }
      case 'rejected':
        return { icon: <Icons.shieldX />, text: 'Verification Rejected', className: 'text-red-600 bg-red-50' }
      default:
        return { icon: <Icons.shield />, text: 'Not Verified', className: 'text-gray-600 bg-gray-50' }
    }
  }

  const dynamicDate = formatDbDate(dbData?.end_date)
  const dynamicPlanName = dbData?.plan_name || 'PRO Monthly'

  const lastPayment = payments?.[0]
  const rawAmount = dbData?.amount || lastPayment?.amount
  const planPrice = dbData?.plan_id === 1 ? '0 DZD' : (rawAmount ? `${rawAmount.toLocaleString()} DZD` : '60,000 DZD')

  const plans: Record<SubscriptionState, SubscriptionPlan> = {
    active: {
      status: 'active',
      planName: dynamicPlanName,
      price: planPrice,
      nextBillingDate: dynamicDate,
      features: getFeaturesForPlan('active'),
    },
    expired: {
      status: 'expired',
      planName: dynamicPlanName,
      price: planPrice,
      expirationDate: dynamicDate,
      features: getFeaturesForPlan('expired'),
    },
    pending: {
      status: 'pending',
      planName: 'Payment Under Review',
      price: planPrice,
      features: getFeaturesForPlan('pending'),
    },
    free: {
      status: 'free',
      planName: 'Free Plan',
      price: '0 DZD',
      features: getFeaturesForPlan('free'),
    },
  }

  const currentPlan = plans[subscriptionState]
  const verificationDisplay = getVerificationStatusDisplay(user?.verification_status)

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAllData} />
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {}
        {user && (
          <Card className={`border p-4 ${verificationDisplay.className}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {verificationDisplay.icon}
                <div>
                  <h3 className="font-bold">Business Verification: {verificationDisplay.text}</h3>
                  {user.verification_status === 'rejected' && user.verification_rejected_reason && (
                    <p className="text-sm mt-1">Reason: {user.verification_rejected_reason}</p>
                  )}
                  {user.verification_status === 'pending' && user.verification_requested_at && (
                    <p className="text-sm mt-1">Requested on: {formatDbDate(user.verification_requested_at)}</p>
                  )}
                </div>
              </div>
              {user.verification_status !== 'verified' && user.verification_status !== 'pending' && (
                <button
                  onClick={handleRequestVerification}
                  disabled={actionLoading === 'verify'}
                  className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#6D28D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === 'verify' ? 'Requesting...' : 'Request Verification'}
                </button>
              )}
            </div>
          </Card>
        )}

        {}
        {subscriptionState === 'expired' && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 flex items-start gap-4">
            <Icons.warning />
            <div className="flex-1">
              <h3 className="font-bold text-red-900">Your subscription has expired</h3>
              <p className="text-red-700 text-sm">Renew now to regain access to your PRO features.</p>
            </div>
            <button
              onClick={handleRenew}
              disabled={actionLoading === 'renew'}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {actionLoading === 'renew' ? 'Processing...' : 'Renew Subscription'}
            </button>
          </div>
        )}

        {}
        {subscriptionState === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-4">
            <Icons.pending />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900">Payment Under Review</h3>
              <p className="text-yellow-700 text-sm">Your payment is being verified by admin (est. 24h). You will be notified once the confirmation is complete.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2">
            <Card className="border border-[#7C3AED] border-2 p-8">
              <div className="space-y-6">
                {}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-gray-900">{currentPlan.planName}</h2>
                    {subscriptionState === 'active' && (
                      <span className="bg-[#B8FF00] text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                        ACTIVE
                      </span>
                    )}
                    {subscriptionState === 'expired' && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                        EXPIRED
                      </span>
                    )}
                    {subscriptionState === 'pending' && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                        PENDING
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#7C3AED]">{currentPlan.price}</span>
                    <span className="text-gray-600 font-semibold">/ month</span>
                  </div>
                </div>

                {}
                <div className="border-t border-gray-200 pt-4">
                  {currentPlan.nextBillingDate && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">Next Billing Date:</span> {currentPlan.nextBillingDate}
                    </p>
                  )}
                  {currentPlan.expirationDate && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">Expired on:</span> {currentPlan.expirationDate}
                    </p>
                  )}
                </div>

                {}
                <div className="grid grid-cols-2 gap-4">
                  {currentPlan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 transition-all ${
                        feature.locked
                          ? 'bg-gray-100 opacity-60 border border-gray-200'
                          : 'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {feature.locked ? <Icons.locked /> : feature.icon}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${feature.locked ? 'text-gray-500' : 'text-gray-900'}`}>
                            {feature.name}
                          </p>
                          <p className={`text-xs mt-1 ${feature.locked ? 'text-gray-400' : 'text-gray-600'}`}>
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {}
                <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-3">
                  {subscriptionState === 'active' && (
                    <>
                      <button className="bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6D28D9] transition-colors cursor-pointer">
                        Change Plan
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
                        View All Plans
                      </button>
                    </>
                  )}
                  {subscriptionState === 'expired' && (
                    <>
                      <button
                        onClick={handleRenew}
                        disabled={actionLoading === 'renew'}
                        className="bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6D28D9] transition-colors disabled:opacity-50"
                      >
                        {actionLoading === 'renew' ? 'Processing...' : 'Renew Subscription'}
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
                        View All Plans
                      </button>
                    </>
                  )}
                  {subscriptionState === 'free' && (
                    <button
                      onClick={() => handleUpgrade('monthly')}
                      disabled={actionLoading === 'upgrade'}
                      className="bg-[#B8FF00] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#a8e600] transition-colors disabled:opacity-50"
                    >
                      {actionLoading === 'upgrade' ? 'Processing...' : 'Upgrade to PRO'}
                    </button>
                  )}
                </div>

                {}
                {subscriptionState === 'active' && (
                  <p className="text-xs text-gray-500 border-t border-gray-200 pt-4">
                    Need to switch to yearly billing? <button onClick={() => handleUpgrade('yearly')} className="text-[#7C3AED] font-semibold hover:underline cursor-pointer">Click here</button> to save 15%.
                  </p>
                )}
              </div>
            </Card>
          </div>

          {}
          <div className="lg:col-span-1">
            <Card className="border-2 border-[#7C3AED] p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Icons.help />
                <h3 className="text-lg font-bold text-gray-900">NEED HELP?</h3>
              </div>

              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Phone Support</p>
                  <p className="text-gray-900 font-semibold">+213 555 987 654</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Billing Support</p>
                  <p className="text-gray-900 font-semibold">livrili.team@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button className="flex-1 bg-[#B8FF00] text-gray-900 px-4 py-3 rounded-lg font-semibold hover:bg-[#a8e600] transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Icons.call />
                  Call
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-900 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Icons.email />
                  Email
                </button>
              </div>
            </Card>
          </div>
        </div>

        {}
        {payments.filter(p => p.rawStatus === 'pending').length > 0 && (
          <Card className="border-2 border-yellow-400 bg-yellow-50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icons.pending />
              <h3 className="text-lg font-bold text-yellow-900">PAYMENT AWAITING ADMIN APPROVAL</h3>
            </div>
            <div className="space-y-4">
              {payments.filter(p => p.rawStatus === 'pending').map((payment) => (
                <div key={payment.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Icons.card />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{payment.amount}</p>
                        <p className="text-sm text-gray-600">{payment.method}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><span className="font-semibold">Submitted:</span> {payment.date}</p>
                      <p><span className="font-semibold">Ref:</span> {payment.ref}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Pending Approval
                      </span>
                      {payment.receipt && (
                        <a
                          href={payment.receipt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7C3AED] hover:underline text-sm font-semibold"
                        >
                          View Receipt →
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 border-t border-gray-100 pt-2">
                    Your payment has been submitted and is currently awaiting admin approval. You will be notified once it is confirmed.
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {}
        <Card className="border border-gray-300 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Icons.card />
              <h3 className="text-xl font-bold text-gray-900">PAYMENT HISTORY</h3>
            </div>
            {payments.length > 0 && (
              <button className="text-[#7C3AED] font-semibold text-sm hover:underline cursor-pointer">
                View All Payment History →
              </button>
            )}
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icons.card />
              <p className="mt-2">No payment history yet. Complete a payment to see it here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Ref</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Method</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={payment.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-700">{payment.date}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{payment.ref}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900">{payment.amount}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{payment.method}</td>
                      <td className="py-4 px-4 text-sm">
                        <span className={`${getStatusBadgeClass(payment.status)} px-3 py-1 rounded-full text-xs font-semibold`}>
                          {payment.status === 'Confirmed' ? ' ' : ''}{payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {payment.receipt ? (
                          <a
                            href={`${apiBase.replace('/api', '')}/${payment.receipt}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download Invoice"
                            className="text-[#7C3AED] hover:text-[#6D28D9] transition-colors cursor-pointer inline-block"
                          >
                            <Icons.download />
                          </a>
                        ) : (
                          <span className="text-gray-400 cursor-not-allowed">
                            <Icons.download />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
