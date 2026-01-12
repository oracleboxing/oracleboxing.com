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

    // Get main product
    const mainProduct = getProductById('21dc-entry')
    if (!mainProduct) {
      return NextResponse.json(
        { error: '21DC product not found' },
        { status: 500 }
      )
    }

    // Calculate new total
    const mainPriceId = getStripePriceId(mainProduct, currency)
    const mainPrice = await stripe.prices.retrieve(mainPriceId)
    let totalAmount = mainPrice.unit_amount || 0

    const lineItemPriceIds: string[] = [mainPriceId]
    const lineItemDescriptions: string[] = []

    // Get main product name
    if (typeof mainPrice.product === 'string') {
      const product = await stripe.products.retrieve(mainPrice.product)
      lineItemDescriptions.push(product.name)
    }

    // Add selected add-ons
    for (const addOnId of addOns) {
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

    // Fetch current PaymentIntent to preserve existing metadata
    const currentPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Update the PaymentIntent with new amount - MERGE metadata to preserve tracking data
    const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      amount: totalAmount,
      metadata: {
        ...currentPaymentIntent.metadata, // Preserve existing metadata (customer info, tracking, etc.)
        line_items: JSON.stringify(lineItemPriceIds),
        product_descriptions: lineItemDescriptions.join(', '),
        add_ons_included: addOns.join(','),
      },
    })

    console.log('Updated PaymentIntent:', paymentIntentId, 'New amount:', totalAmount, currency)

    return NextResponse.json({
      success: true,
      amount: totalAmount,
    })
  } catch (error: any) {
    console.error('PaymentIntent update failed:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update payment' },
      { status: 500 }
    )
  }
}
