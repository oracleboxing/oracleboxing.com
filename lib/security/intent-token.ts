import crypto from 'crypto'

export type IntentTokenPurpose = 'payment_intent_client_secret_fetch'

interface IntentTokenPayload {
  intent_id: string
  purpose: IntentTokenPurpose
  exp: number
  email_hash?: string
}

interface MintIntentTokenParams {
  intentId: string
  purpose: IntentTokenPurpose
  customerEmail?: string | null
  ttlSeconds?: number
}

interface VerifyIntentTokenParams {
  token: string
  intentId: string
  purpose: IntentTokenPurpose
  customerEmail?: string | null
}

const DEFAULT_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 days - links are shared via DMs

function getSigningSecret(): string {
  const secret =
    process.env.PAYMENT_INTENT_PROOF_SECRET || process.env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error(
      'Missing PAYMENT_INTENT_PROOF_SECRET (or NEXTAUTH_SECRET fallback)'
    )
  }

  return secret
}

function base64urlEncode(input: string): string {
  return Buffer.from(input, 'utf-8').toString('base64url')
}

function base64urlDecode(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf-8')
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

function emailHash(email: string | null | undefined): string | undefined {
  if (!email) return undefined
  return crypto
    .createHash('sha256')
    .update(email.trim().toLowerCase())
    .digest('hex')
}

export function mintIntentToken(params: MintIntentTokenParams): string {
  const now = Math.floor(Date.now() / 1000)
  const payload: IntentTokenPayload = {
    intent_id: params.intentId,
    purpose: params.purpose,
    exp: now + (params.ttlSeconds || DEFAULT_TTL_SECONDS),
    email_hash: emailHash(params.customerEmail),
  }

  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = base64urlEncode(JSON.stringify(header))
  const encodedPayload = base64urlEncode(JSON.stringify(payload))
  const unsigned = `${encodedHeader}.${encodedPayload}`
  const signature = sign(unsigned, getSigningSecret())

  return `${unsigned}.${signature}`
}

export function verifyIntentToken(
  params: VerifyIntentTokenParams
): { ok: true } | { ok: false; reason: string } {
  const tokenParts = params.token.split('.')
  if (tokenParts.length !== 3) {
    return { ok: false, reason: 'Invalid token format' }
  }

  const [encodedHeader, encodedPayload, providedSignature] = tokenParts
  const unsigned = `${encodedHeader}.${encodedPayload}`
  const expectedSignature = sign(unsigned, getSigningSecret())

  if (!safeEqual(providedSignature, expectedSignature)) {
    return { ok: false, reason: 'Invalid token signature' }
  }

  let payload: IntentTokenPayload
  try {
    payload = JSON.parse(base64urlDecode(encodedPayload)) as IntentTokenPayload
  } catch {
    return { ok: false, reason: 'Invalid token payload' }
  }

  const now = Math.floor(Date.now() / 1000)
  if (!payload.exp || payload.exp < now) {
    return { ok: false, reason: 'Token expired' }
  }

  if (payload.purpose !== params.purpose) {
    return { ok: false, reason: 'Token purpose mismatch' }
  }

  if (payload.intent_id !== params.intentId) {
    return { ok: false, reason: 'Token intent mismatch' }
  }

  const expectedEmailHash = emailHash(params.customerEmail)
  if (
    expectedEmailHash &&
    payload.email_hash &&
    payload.email_hash !== expectedEmailHash
  ) {
    return { ok: false, reason: 'Token email mismatch' }
  }

  return { ok: true }
}
