'use client'

const SNIPER_LINKS = [
  {
    name: 'Gmail',
    logo: 'https://sniperl.ink/logos/gmail.png',
    buildUrl: (email: string, sender: string) =>
      `https://mail.google.com/mail/u/${email}/#search/from:(${sender})+in:anywhere+newer_than:1h`,
    bg: 'bg-[#4285F4] hover:bg-[#3367D6]',
  },
  {
    name: 'Outlook',
    logo: 'https://sniperl.ink/logos/outlook.png',
    buildUrl: (_email: string, sender: string) =>
      `https://outlook.live.com/mail/0/inbox?searchQuery=from:${sender}`,
    bg: 'bg-[#0078D4] hover:bg-[#106EBE]',
  },
]

interface EmailSniperLinkProps {
  email?: string
  sender?: string
  message?: string
}

export function EmailSniperLink({
  email = '0',
  sender = 'noreply@skool.com',
  message = 'We just sent you an email with your community invite.',
}: EmailSniperLinkProps) {
  // Try to detect email domain for smart defaults
  const isGmail = email.endsWith('@gmail.com') || email.endsWith('@googlemail.com')
  const isOutlook = email.endsWith('@outlook.com') || email.endsWith('@hotmail.com') || email.endsWith('@live.com')

  return (
    <div className="bg-[#F5F3F1] rounded-xl p-6 max-w-md mx-auto text-center">
      <p className="text-[#49423D] text-sm mb-4">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {SNIPER_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.buildUrl(email, sender)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.bg} text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={link.logo} alt={link.name} className="h-5 w-5" />
            Open {link.name}
          </a>
        ))}
      </div>
    </div>
  )
}
