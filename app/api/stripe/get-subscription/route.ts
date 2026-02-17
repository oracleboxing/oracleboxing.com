import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subscriptionId = searchParams.get('id');

  if (!subscriptionId || !subscriptionId.startsWith('sub_')) {
    return NextResponse.json(
      { error: 'A valid Subscription ID is required' },
      { status: 400 }
    );
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['customer', 'items.data.price.product'],
    });

    return NextResponse.json(subscription);

  } catch (error: any) {
    console.error('Stripe Subscription retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
