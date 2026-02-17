import { NextRequest, NextResponse } from 'next/server'
import { notifyOps } from '@/lib/slack-notify'
const sgClient = require('@sendgrid/client')
const twilio = require('twilio')

// SendGrid list IDs
const WAITLIST_LIST_ID = '3a1ba08c-6247-4684-86a2-7b652bf60e5b'
const CHECKOUT_LIST_ID = '6a8d2576-c648-4edd-8dbf-f224341a3908'

// Twilio config
const TWILIO_FROM = '+447446499091'

function getTwilioClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )
}

function getSendGridClient() {
  sgClient.setApiKey(process.env.SENDGRID_API_KEY!)
  return sgClient
}

async function addToSendGridList(listId: string, contact: { email: string; firstName?: string; lastName?: string; phone?: string }) {
  const sg = getSendGridClient()
  const data = {
    list_ids: [listId],
    contacts: [{
      email: contact.email,
      first_name: contact.firstName || '',
      last_name: contact.lastName || '',
      phone_number: contact.phone || '',
    }],
  }
  const [response] = await sg.request({
    url: '/v3/marketing/contacts',
    method: 'PUT',
    body: data,
  })
  return response.statusCode
}

function verifyInternalToken(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  return !!token && token === process.env.INTERNAL_API_TOKEN
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type } = body

    // Abandon type sends SMS - require auth
    if (type === 'abandon' && !verifyInternalToken(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (type === 'waitlist') {
      // Add to SendGrid waitlist + notify Slack
      const { firstName, lastName, email, phone } = body
      const sgStatus = await addToSendGridList(WAITLIST_LIST_ID, { email, firstName, lastName, phone })
      notifyOps(`📋 Waitlist signup - ${firstName} ${lastName} (${email}) ${phone || ''}`.trim())
      return NextResponse.json({ success: true, sendgrid: sgStatus })

    } else if (type === 'checkout') {
      // Add to SendGrid checkout list + notify Slack
      const { first_name, last_name, email, phone, recovery_url } = body
      const sgStatus = await addToSendGridList(CHECKOUT_LIST_ID, { email, firstName: first_name, lastName: last_name, phone })
      notifyOps(`🛒 Checkout initiated - ${first_name} ${last_name} (${email})`)
      return NextResponse.json({ success: true, sendgrid: sgStatus })

    } else if (type === 'abandon') {
      // Send SMS via Twilio + notify Slack
      const { first_name, phone, recovery_url } = body
      if (!phone) {
        notifyOps(`⚠️ Abandoned cart - ${first_name} (${body.email}) - no phone number, SMS skipped`)
        return NextResponse.json({ success: false, reason: 'no_phone' })
      }

      try {
        const twilioClient = getTwilioClient()
        const message = await twilioClient.messages.create({
          body: `${first_name}, you didn't finish signing up for the 21-Day Challenge. If you still want in: oracleboxing.com/sms`,
          from: TWILIO_FROM,
          to: phone,
        })
        notifyOps(`📲 Abandoned cart SMS sent - ${first_name} (${body.email}) to ${phone} [${message.sid}]`)
        return NextResponse.json({ success: true, messageSid: message.sid })
      } catch (smsErr: any) {
        notifyOps(`❌ Abandoned cart SMS failed - ${first_name} (${body.email}) to ${phone}: ${smsErr.message}`)
        return NextResponse.json({ success: false, error: smsErr.message }, { status: 500 })
      }

    } else {
      return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Notification route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
