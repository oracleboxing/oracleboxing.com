'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SignInContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/coaching-checkout'
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#37322F] rounded-2xl mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-sub font-semibold text-[#37322F] font-sans">
            Oracle Boxing Admin
          </h1>
          <p className="text-body text-[#847971] mt-1.5 font-sans">
            Sign in to continue
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-body text-red-600 text-center font-sans">
              {error === 'AccessDenied'
                ? 'Access denied. Your account is not authorised.'
                : 'Something went wrong. Please try again.'}
            </p>
          </div>
        )}

        {/* Sign in card */}
        <div className="bg-white rounded-2xl border border-[rgba(55,50,47,0.08)] p-8 shadow-sm">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            <span className="text-body font-medium text-[#37322F] font-sans group-hover:text-[#1a1611]">
              Continue with Google
            </span>
          </button>

          <p className="text-xs text-[#A39E9B] text-center mt-5 font-sans">
            Restricted to authorised accounts only
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-[#A39E9B] text-center mt-8 font-sans">
          Oracle Boxing &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#37322F] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
