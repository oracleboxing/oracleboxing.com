import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth-options'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

/**
 * IMPORTANT: Add these redirect URIs to Google Cloud Console
 * (APIs & Services → Credentials → OAuth 2.0 Client ID):
 *
 * Production:
 *   https://www.oracleboxing.com/api/auth/callback/google
 *
 * Local dev:
 *   http://localhost:3000/api/auth/callback/google
 */
