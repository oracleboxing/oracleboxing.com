import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import client from '@sendgrid/client'
import { getSupabaseServerClient } from '@/lib/supabase'

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || ''
const SLACK_OPS_CHANNEL_ID = process.env.SLACK_OPS_CHANNEL_ID || ''
const QUIZ_LIST_ID = 'ea0b6d8d-4ac1-4da1-a854-3ae5e6fb3a4d'
const FROM_EMAIL = 'team@oracleboxing.com'
const FROM_NAME = 'Oracle Boxing'

sgMail.setApiKey(SENDGRID_API_KEY)
client.setApiKey(SENDGRID_API_KEY)

async function addToSendGridList(email: string, firstName: string, listId: string) {
  const data = {
    list_ids: [listId],
    contacts: [
      {
        email,
        first_name: firstName,
      },
    ],
  }
  await client.request({
    url: '/v3/marketing/contacts',
    method: 'PUT',
    body: data,
  })
}

async function sendResultsEmail(email: string, firstName: string, resultId: string) {
  const resultsUrl = `https://oracleboxing.com/quiz/results-diagnostic?id=${resultId}`

  const msg = {
    to: email,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: `${firstName}, your boxing quiz results`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="https://sb.oracleboxing.com/logo/long_dark.webp" alt="Oracle Boxing" width="200" height="40" style="height: 40px; width: auto; max-width: 200px;" />
        </div>
        <h1 style="font-size: 24px; color: #1a1a1a; margin-bottom: 16px;">Thanks for taking the quiz, ${firstName}.</h1>
        <p style="font-size: 16px; color: #525252; line-height: 1.6; margin-bottom: 24px;">
          Your results are ready. Bookmark this link so you can come back to them anytime:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resultsUrl}" style="display: inline-block; background: #37322F; color: #ffffff; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px;">
            View My Results
          </a>
        </div>
        <p style="font-size: 14px; color: #a3a3a3; line-height: 1.5; margin-top: 32px;">
          If you have any questions about your results or want to improve your weakest areas, reply to this email. We read every one.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
        <p style="font-size: 12px; color: #a3a3a3; text-align: center;">
          <a href="https://oracleboxing.com" style="color: #a3a3a3;">oracleboxing.com</a>
        </p>
      </div>
    `,
  }
  await sgMail.send(msg)
}

async function notifySlack(text: string) {
  if (!SLACK_BOT_TOKEN || !SLACK_OPS_CHANNEL_ID) return
  try {
    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: SLACK_OPS_CHANNEL_ID,
        text,
      }),
    })
  } catch (e) {
    console.error('Slack notification failed:', e)
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { id, name, email } = await request.json()

    // Validate inputs
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!id || !name?.trim() || !email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const firstName = name.trim().split(' ')[0]

    // Update Supabase record with name/email
    const supabase = getSupabaseServerClient()
    supabase.from('quiz_results').update({ name, email }).eq('id', id).then(() => {}).catch(() => {})

    // Run all async operations in parallel
    await Promise.allSettled([
      addToSendGridList(email, firstName, QUIZ_LIST_ID),
      sendResultsEmail(email, firstName, id),
      notifySlack(`🥊 *Quiz completed* — ${firstName} (${email}) just took the boxing quiz`),
    ])

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Error in quiz capture-email:', e)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
