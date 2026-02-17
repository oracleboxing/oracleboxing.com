'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { trackPurchase } from '@/lib/webhook-tracking'
import { getProductByMetadata } from '@/lib/products'

// Helper to fire Gtag event
const fireGtagPurchase = (subscription: any) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = window.gtag as Function
    const plan = subscription.items.data[0]?.price?.recurring?.interval || 'monthly'
    const product = getProductByMetadata(plan === 'annual' ? 'mema' : 'mem_monthly')

    if (!product) return

    gtag('event', 'purchase', {
      transaction_id: subscription.id,
      value: subscription.items.data[0].price.unit_amount / 100,
      currency: subscription.currency.toUpperCase(),
      items: [{
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity: 1
      }]
    })
  }
}

export default function MembershipSuccessContent({ subscriptionId }: { subscriptionId: string }) {

  useEffect(() => {
    // This is a client-side fetch to get subscription details for tracking
    // The server has already verified the subscription, so this is just for analytics
    fetch(`/api/stripe/get-subscription?id=${subscriptionId}`)
      .then(res => res.json())
      .then(sub => {
        if (sub && sub.id) {
          const plan = sub.items.data[0]?.price?.recurring?.interval || 'monthly'
          const product = getProductByMetadata(plan === 'annual' ? 'mema' : 'mem_monthly')
          if (product) {
            trackPurchase(
              sub.id,
              product.price,
              'USD',
              [product.id],
              {
                name: sub.customer?.name || '',
                email: sub.customer?.email || '',
              }
            )
            fireGtagPurchase(sub);
          }
        }
      })
      .catch(console.error);
  }, [subscriptionId])

  return (
    <>
      <Script
        id="fb-pixel-success"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '139311359413254');
            fbq('track', 'Purchase', {currency: "USD", value: 97.00});
          `,
        }}
      />
      <div className="text-center max-w-lg mx-auto p-8">
        <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="mt-6 text-3xl font-bold text-[#37322F]">Thanks for joining Oracle Boxing!</h1>
        <p className="mt-4 text-lg text-[#49423D]">
          Check your email for your invite to join the Skool community.
        </p>
        <p className="mt-2 text-md text-[#847971]">
          If you have any questions, reach out to <a href="mailto:team@oracleboxing.com" className="text-[#37322F] underline">team@oracleboxing.com</a>.
        </p>
      </div>
    </>
  )
}
