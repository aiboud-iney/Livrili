'use client'

import { useGoogleLogin } from '@react-oauth/google'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface Props {
  disabled?: boolean
  onStart: () => void
  onSuccess: (token: string, user: unknown) => void
  onError: (message: string) => void
}

export function GoogleLoginButton({ disabled, onStart, onSuccess, onError }: Props) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      onStart()
      try {
        const res = await fetch(`${API_BASE_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        })
        const data = await res.json()
        if (!res.ok) {
          onError(data.message || 'Google login failed. Please try again.')
          return
        }
        onSuccess(data.token, data.user)
      } catch {
        onError('Network error. Please check your connection.')
      }
    },
    onError: () => onError('Google sign-in was cancelled or failed.'),
  })

  return (
    <button
      type="button"
      className="w-auto mx-auto flex items-center justify-center gap-3 px-8 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      onClick={() => login()}
      disabled={disabled}
    >
      <img src="/icons/google.png" alt="Google" className="w-5 h-5 object-contain" />
      <span className="text-gray-700 font-medium">Google</span>
    </button>
  )
}
