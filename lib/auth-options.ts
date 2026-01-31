import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Admin email allowlist - individual emails or @domain for whole org
const ADMIN_EMAILS = [
  'jordan@oracleboxing.com',
]
const ADMIN_DOMAINS = [
  'oracleboxing.com',
]

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    /**
     * Restrict sign-in to admin emails only.
     * Non-admin Google accounts are rejected at login.
     */
    async signIn({ user }) {
      if (!user.email) return false
      const email = user.email.toLowerCase()
      const domain = email.split('@')[1]
      return ADMIN_EMAILS.includes(email) || ADMIN_DOMAINS.includes(domain)
    },

    /**
     * Include email in the JWT token
     */
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
      }
      return token
    },

    /**
     * Include email in the session object
     */
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string
      }
      return session
    },
  },

  pages: {
    error: '/api/auth/error',
  },
}
