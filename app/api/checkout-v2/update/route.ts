import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { Currency, getStripePriceId } from '@/lib/currency'
import { getProductById } from '@/lib/products'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      paymentIntentId,
      currency = 'USD',
      addOns = [],
    }: {
      paymentIntentId: string
      currency?: Currency
      addOns?: string[]
    } = body

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // Determine main product from existing PaymentIntent metadata
    const existingPI = await stripe.paymentIntents.retrieve(paymentIntentId)
    const funnelType = existingPI.metadata?.funnel_type || '21dc'
    const existingPlan = existingPI.metadata?.plan || 'monthly'

    // Check if upgrading from monthly to annual
    const isUpgradeToAnnual = funnelType === 'membership' && addOns.includes('upgrade-annual')
    const effectivePlan = isUpgradeToAnnual ? 'annual' : existingPlan
    const filteredAddOns = addOns.filter(id => id !== 'upgrade-annual')

    let mainProductId: string
    if (funnelType === 'membership') {
      mainProductId = effectivePlan === 'annual' ? 'membership-annual' : 'membership-monthly'
    } else {
      mainProductId = '21dc-entry'
    }

    const mainProduct = getProductById(mainProductId)
    if (!mainProduct) {
      return NextResponse.json(
        { error: `Product ${mainProductId} not found` },
        { status: 500 }
      )
    }

    // Calculate new total
    const mainPriceId = funnelType === 'membership' ? mainProduct.stripe_price_id : getStripePriceId(mainProduct, currency)
    const mainPrice = await stripe.prices.retrieve(mainPriceId)
    let totalAmount = mainPrice.unit_amount || 0

    const lineItemPriceIds: string[] = [mainPriceId]
    const lineItemDescriptions: string[] = []

    // Get main product name
    if (typeof mainPrice.product === 'string') {
      const product = await stripe.products.retrieve(mainPrice.product)
      lineItemDescriptions.push(product.name)
    }

    // Add selected add-ons (excluding upgrade-annual pseudo add-on)
    for (const addOnId of filteredAddOns) {
      const addOnProduct = getProductById(addOnId)
      if (addOnProduct) {
        const addOnPriceId = getStripePriceId(addOnProduct, currency)
        const addOnPrice = await stripe.prices.retrieve(addOnPriceId)
        if (addOnPrice.unit_amount) {
          totalAmount += addOnPrice.unit_amount
        }
        lineItemPriceIds.push(addOnPriceId)

        if (typeof addOnPrice.product === 'string') {
          const product = await stripe.products.retrieve(addOnPrice.product)
          lineItemDescriptions.push(product.name)
        }
      }
    }

    // Update the PaymentIntent with new amount - MERGE metadata to preserve tracking data
    const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      amount: totalAmount,
      metadata: {
        ...existingPI.metadata,
        line_items: JSON.stringify(lineItemPriceIds),
        product_descriptions: lineItemDescriptions.join(', '),
        add_ons_included: filteredAddOns.join(','),
        plan: effectivePlan,
        entry_product: mainProductId,
        membership_price_id: funnelType === 'membership' ? mainPriceId : (existingPI.metadata?.membership_price_id || ''),
        upgraded_to_annual: isUpgradeToAnnual ? 'true' : 'false',
      },
    })

    return NextResponse.json({
      success: true,
      amount: totalAmount,
    })
  } catch (error: any) {
    console.error('Route /api/checkout-v2/update failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
