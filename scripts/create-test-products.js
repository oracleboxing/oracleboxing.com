const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createTestProducts() {
  console.log('Creating test products and prices...\n');

  try {
    // 1. Create 21DC Entry Product
    const product21dc = await stripe.products.create({
      name: '21-Day Challenge Entry',
      description: 'Prove you have what it takes. Show up twice a week, submit one video, and earn your place in Oracle Boxing.',
      metadata: {
        product_id: '21dc-entry',
        type: 'challenge',
      },
    });
    console.log('Created product: 21-Day Challenge Entry -', product21dc.id);

    // Create prices for 21DC in multiple currencies
    const price21dcUSD = await stripe.prices.create({
      product: product21dc.id,
      unit_amount: 14700, // $147
      currency: 'usd',
    });
    console.log('  USD price:', price21dcUSD.id, '- $147');

    const price21dcGBP = await stripe.prices.create({
      product: product21dc.id,
      unit_amount: 11900, // £119
      currency: 'gbp',
    });
    console.log('  GBP price:', price21dcGBP.id, '- £119');

    const price21dcEUR = await stripe.prices.create({
      product: product21dc.id,
      unit_amount: 13900, // €139
      currency: 'eur',
    });
    console.log('  EUR price:', price21dcEUR.id, '- €139');

    const price21dcAUD = await stripe.prices.create({
      product: product21dc.id,
      unit_amount: 22900, // $229 AUD
      currency: 'aud',
    });
    console.log('  AUD price:', price21dcAUD.id, '- $229 AUD');

    const price21dcCAD = await stripe.prices.create({
      product: product21dc.id,
      unit_amount: 19900, // $199 CAD
      currency: 'cad',
    });
    console.log('  CAD price:', price21dcCAD.id, '- $199 CAD');

    // 2. Create BFFP Product
    const productBFFP = await stripe.products.create({
      name: 'Boxing from First Principles',
      description: '26 lessons across 5 modules teaching boxing fundamentals',
      metadata: {
        product_id: 'bffp',
        type: 'course',
      },
    });
    console.log('\nCreated product: Boxing from First Principles -', productBFFP.id);

    const priceBFFPUSD = await stripe.prices.create({
      product: productBFFP.id,
      unit_amount: 24700, // $247
      currency: 'usd',
    });
    console.log('  USD price:', priceBFFPUSD.id, '- $247');

    const priceBFFPGBP = await stripe.prices.create({
      product: productBFFP.id,
      unit_amount: 19700, // £197
      currency: 'gbp',
    });
    console.log('  GBP price:', priceBFFPGBP.id, '- £197');

    const priceBFFPEUR = await stripe.prices.create({
      product: productBFFP.id,
      unit_amount: 22700, // €227
      currency: 'eur',
    });
    console.log('  EUR price:', priceBFFPEUR.id, '- €227');

    const priceBFFPAUD = await stripe.prices.create({
      product: productBFFP.id,
      unit_amount: 37900, // $379 AUD
      currency: 'aud',
    });
    console.log('  AUD price:', priceBFFPAUD.id, '- $379 AUD');

    const priceBFFPCAD = await stripe.prices.create({
      product: productBFFP.id,
      unit_amount: 32900, // $329 CAD
      currency: 'cad',
    });
    console.log('  CAD price:', priceBFFPCAD.id, '- $329 CAD');

    // 3. Create Tracksuit Product
    const productTracksuit = await stripe.products.create({
      name: 'Oracle Boxing Tracksuit',
      description: 'Premium tracksuit. Made in Britain. 100% cotton.',
      metadata: {
        product_id: 'tracksuit',
        type: 'physical',
      },
    });
    console.log('\nCreated product: Oracle Boxing Tracksuit -', productTracksuit.id);

    const priceTracksuitUSD = await stripe.prices.create({
      product: productTracksuit.id,
      unit_amount: 18700, // $187
      currency: 'usd',
    });
    console.log('  USD price:', priceTracksuitUSD.id, '- $187');

    const priceTracksuitGBP = await stripe.prices.create({
      product: productTracksuit.id,
      unit_amount: 14900, // £149
      currency: 'gbp',
    });
    console.log('  GBP price:', priceTracksuitGBP.id, '- £149');

    const priceTracksuitEUR = await stripe.prices.create({
      product: productTracksuit.id,
      unit_amount: 17200, // €172
      currency: 'eur',
    });
    console.log('  EUR price:', priceTracksuitEUR.id, '- €172');

    const priceTracksuitAUD = await stripe.prices.create({
      product: productTracksuit.id,
      unit_amount: 28700, // $287 AUD
      currency: 'aud',
    });
    console.log('  AUD price:', priceTracksuitAUD.id, '- $287 AUD');

    const priceTracksuitCAD = await stripe.prices.create({
      product: productTracksuit.id,
      unit_amount: 24900, // $249 CAD
      currency: 'cad',
    });
    console.log('  CAD price:', priceTracksuitCAD.id, '- $249 CAD');

    // 4. Create Vault 2025 Product
    const productVault = await stripe.products.create({
      name: '2025 Call Recording Vault',
      description: '620+ coaching call recordings from 2025',
      metadata: {
        product_id: 'vault-2025',
        type: 'digital',
      },
    });
    console.log('\nCreated product: 2025 Call Recording Vault -', productVault.id);

    const priceVaultUSD = await stripe.prices.create({
      product: productVault.id,
      unit_amount: 29700, // $297
      currency: 'usd',
    });
    console.log('  USD price:', priceVaultUSD.id, '- $297');

    const priceVaultGBP = await stripe.prices.create({
      product: productVault.id,
      unit_amount: 23700, // £237
      currency: 'gbp',
    });
    console.log('  GBP price:', priceVaultGBP.id, '- £237');

    const priceVaultEUR = await stripe.prices.create({
      product: productVault.id,
      unit_amount: 27300, // €273
      currency: 'eur',
    });
    console.log('  EUR price:', priceVaultEUR.id, '- €273');

    const priceVaultAUD = await stripe.prices.create({
      product: productVault.id,
      unit_amount: 45600, // $456 AUD
      currency: 'aud',
    });
    console.log('  AUD price:', priceVaultAUD.id, '- $456 AUD');

    const priceVaultCAD = await stripe.prices.create({
      product: productVault.id,
      unit_amount: 39500, // $395 CAD
      currency: 'cad',
    });
    console.log('  CAD price:', priceVaultCAD.id, '- $395 CAD');

    // Output the price IDs for updating the code
    console.log('\n\n=== PRICE IDS TO UPDATE IN CODE ===\n');
    console.log('// 21DC Entry');
    console.log(`USD: '${price21dcUSD.id}'`);
    console.log(`GBP: '${price21dcGBP.id}'`);
    console.log(`EUR: '${price21dcEUR.id}'`);
    console.log(`AUD: '${price21dcAUD.id}'`);
    console.log(`CAD: '${price21dcCAD.id}'`);

    console.log('\n// BFFP');
    console.log(`USD: '${priceBFFPUSD.id}'`);
    console.log(`GBP: '${priceBFFPGBP.id}'`);
    console.log(`EUR: '${priceBFFPEUR.id}'`);
    console.log(`AUD: '${priceBFFPAUD.id}'`);
    console.log(`CAD: '${priceBFFPCAD.id}'`);

    console.log('\n// Tracksuit');
    console.log(`USD: '${priceTracksuitUSD.id}'`);
    console.log(`GBP: '${priceTracksuitGBP.id}'`);
    console.log(`EUR: '${priceTracksuitEUR.id}'`);
    console.log(`AUD: '${priceTracksuitAUD.id}'`);
    console.log(`CAD: '${priceTracksuitCAD.id}'`);

    console.log('\n// Vault 2025');
    console.log(`USD: '${priceVaultUSD.id}'`);
    console.log(`GBP: '${priceVaultGBP.id}'`);
    console.log(`EUR: '${priceVaultEUR.id}'`);
    console.log(`AUD: '${priceVaultAUD.id}'`);
    console.log(`CAD: '${priceVaultCAD.id}'`);

    console.log('\n\nDone! Products and prices created successfully.');

  } catch (error) {
    console.error('Error creating products:', error);
  }
}

createTestProducts();
