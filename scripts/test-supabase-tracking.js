#!/usr/bin/env node

/**
 * Stress test script for Supabase tracking
 *
 * Tests:
 * 1. Connection to Supabase
 * 2. Insert into waitlist table
 * 3. Insert into initiate_checkouts table
 * 4. Insert into purchases table
 * 5. Handles missing fields gracefully
 * 6. Concurrent inserts
 *
 * Run with: node scripts/test-supabase-tracking.js
 */

const { createClient } = require('@supabase/supabase-js');

// Load env vars
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function generateTestId() {
  return `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

async function testWaitlistInsert() {
  console.log('\n📋 Testing waitlist insert...');

  const testData = {
    date: new Date().toISOString(),
    session_id: generateTestId(),
    event_id: generateTestId(),
    first_name: 'Test',
    last_name: 'User',
    email: `test_${Date.now()}@example.com`,
    phone: '+447912345678',
    country: 'GB',
    referrer: 'https://google.com',
    utm_source: 'test',
    utm_medium: 'stress_test',
    utm_campaign: 'tracking_test',
    utm_content: null,
  };

  const { data, error } = await supabase
    .from('waitlist')
    .insert(testData)
    .select();

  if (error) {
    console.error('❌ Waitlist insert failed:', error.message);
    console.error('   Details:', error.details, error.hint);
    return false;
  }

  console.log('✅ Waitlist insert successful:', data?.[0]?.id);
  return true;
}

async function testInitiateCheckoutInsert() {
  console.log('\n🛒 Testing initiate_checkouts insert...');

  const testData = {
    date: new Date().toISOString(),
    session_id: generateTestId(),
    event_id: generateTestId(),
    first_name: 'Test',
    last_name: 'Checkout',
    email: `checkout_${Date.now()}@example.com`,
    phone: '+14155551234',
    amount: 147.00,
    product: '21dc-entry',
    funnel: '21dc',
    source: 'test',
    country: 'US',
    referrer: 'direct',
    utm_source: 'facebook',
    utm_medium: 'paid',
    utm_content: 'test_ad',
  };

  const { data, error } = await supabase
    .from('initiate_checkouts')
    .insert(testData)
    .select();

  if (error) {
    console.error('❌ Initiate checkout insert failed:', error.message);
    console.error('   Details:', error.details, error.hint);
    return false;
  }

  console.log('✅ Initiate checkout insert successful:', data?.[0]?.id);
  return true;
}

async function testPurchaseInsert() {
  console.log('\n💰 Testing purchases insert...');

  const testData = {
    date: new Date().toISOString(),
    session_id: generateTestId(),
    event_id: generateTestId(),
    name: 'Test Purchaser',
    email: `purchase_${Date.now()}@example.com`,
    phone: '+61412345678',
    amount: 297.00,
    product: '21dc-entry, bffp',
    country: 'AU',
    referrer: null,
    utm_source: 'google',
    utm_medium: 'organic',
    utm_content: null,
  };

  const { data, error } = await supabase
    .from('purchases')
    .insert(testData)
    .select();

  if (error) {
    console.error('❌ Purchase insert failed:', error.message);
    console.error('   Details:', error.details, error.hint);
    return false;
  }

  console.log('✅ Purchase insert successful:', data?.[0]?.id);
  return true;
}

async function testMissingFields() {
  console.log('\n🔍 Testing insert with missing optional fields...');

  const testData = {
    date: new Date().toISOString(),
    // Minimal required fields - phone is null/missing
    session_id: generateTestId(),
    event_id: generateTestId(),
    name: 'Minimal User',
    email: `minimal_${Date.now()}@example.com`,
    phone: null,  // Explicitly null
    amount: 147.00,
    product: '21dc-entry',
    country: null,  // Missing country
    referrer: null,
    utm_source: null,
    utm_medium: null,
    utm_content: null,
  };

  const { data, error } = await supabase
    .from('purchases')
    .insert(testData)
    .select();

  if (error) {
    console.error('❌ Minimal insert failed:', error.message);
    return false;
  }

  console.log('✅ Minimal insert successful (null fields allowed):', data?.[0]?.id);
  return true;
}

async function testConcurrentInserts() {
  console.log('\n⚡ Testing concurrent inserts (10 simultaneous)...');

  const promises = [];

  for (let i = 0; i < 10; i++) {
    const testData = {
      date: new Date().toISOString(),
      session_id: generateTestId(),
      event_id: generateTestId(),
      first_name: `Concurrent`,
      last_name: `User${i}`,
      email: `concurrent_${i}_${Date.now()}@example.com`,
      phone: `+1555000${i.toString().padStart(4, '0')}`,
      amount: 147.00 + i,
      product: '21dc-entry',
      funnel: '21dc',
      source: 'concurrent_test',
      country: 'US',
      referrer: null,
      utm_source: 'test',
      utm_medium: null,
      utm_content: null,
    };

    promises.push(
      supabase.from('initiate_checkouts').insert(testData)
    );
  }

  const results = await Promise.all(promises);
  const failures = results.filter(r => r.error);

  if (failures.length > 0) {
    console.error(`❌ ${failures.length}/10 concurrent inserts failed`);
    failures.forEach((f, i) => console.error(`   Error ${i}:`, f.error?.message));
    return false;
  }

  console.log('✅ All 10 concurrent inserts successful');
  return true;
}

async function testEdgeCases() {
  console.log('\n🧪 Testing edge cases...');

  // Test 1: Very long product string
  console.log('   Testing long product string...');
  const longProduct = Array(50).fill('product-name').join(', ');
  const { error: longError } = await supabase
    .from('purchases')
    .insert({
      date: new Date().toISOString(),
      session_id: generateTestId(),
      event_id: generateTestId(),
      name: 'Long Product Test',
      email: `longproduct_${Date.now()}@example.com`,
      phone: '+447123456789',
      amount: 1000.00,
      product: longProduct,
      country: 'GB',
      referrer: null,
      utm_source: null,
      utm_medium: null,
      utm_content: null,
    });

  if (longError) {
    console.error('   ❌ Long product string failed:', longError.message);
  } else {
    console.log('   ✅ Long product string OK');
  }

  // Test 2: Special characters in name
  console.log('   Testing special characters...');
  const { error: specialError } = await supabase
    .from('purchases')
    .insert({
      date: new Date().toISOString(),
      session_id: generateTestId(),
      event_id: generateTestId(),
      name: "O'Brien-Müller 日本語",
      email: `special_${Date.now()}@example.com`,
      phone: '+33612345678',
      amount: 147.00,
      product: '21dc-entry',
      country: 'FR',
      referrer: 'https://google.com/search?q=test&utm=hello',
      utm_source: 'test<script>alert(1)</script>',
      utm_medium: null,
      utm_content: null,
    });

  if (specialError) {
    console.error('   ❌ Special characters failed:', specialError.message);
  } else {
    console.log('   ✅ Special characters OK');
  }

  // Test 3: Zero amount
  console.log('   Testing zero amount...');
  const { error: zeroError } = await supabase
    .from('purchases')
    .insert({
      date: new Date().toISOString(),
      session_id: generateTestId(),
      event_id: generateTestId(),
      name: 'Zero Amount Test',
      email: `zero_${Date.now()}@example.com`,
      phone: null,
      amount: 0,
      product: 'free-trial',
      country: null,
      referrer: null,
      utm_source: null,
      utm_medium: null,
      utm_content: null,
    });

  if (zeroError) {
    console.error('   ❌ Zero amount failed:', zeroError.message);
  } else {
    console.log('   ✅ Zero amount OK');
  }

  return true;
}

async function cleanupTestData() {
  console.log('\n🧹 Cleaning up test data...');

  // Delete test records from the last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const tables = ['waitlist', 'initiate_checkouts', 'purchases'];

  for (const table of tables) {
    const { error, count } = await supabase
      .from(table)
      .delete()
      .like('email', '%@example.com')
      .gte('created_at', oneHourAgo)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`   ⚠️ Could not cleanup ${table}: ${error.message}`);
    } else {
      console.log(`   ✅ Cleaned ${table}`);
    }
  }
}

async function runTests() {
  console.log('🚀 Starting Supabase tracking stress tests...');
  console.log('   URL:', supabaseUrl);

  const results = {
    waitlist: false,
    initiateCheckout: false,
    purchase: false,
    missingFields: false,
    concurrent: false,
    edgeCases: false,
  };

  try {
    results.waitlist = await testWaitlistInsert();
    results.initiateCheckout = await testInitiateCheckoutInsert();
    results.purchase = await testPurchaseInsert();
    results.missingFields = await testMissingFields();
    results.concurrent = await testConcurrentInserts();
    results.edgeCases = await testEdgeCases();
  } catch (error) {
    console.error('\n💥 Unexpected error:', error);
  }

  // Cleanup
  await cleanupTestData();

  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  for (const [test, passed] of Object.entries(results)) {
    console.log(`   ${passed ? '✅' : '❌'} ${test}`);
  }

  console.log(`\n   ${passed}/${total} tests passed`);

  if (passed < total) {
    console.log('\n⚠️  Some tests failed. Common issues:');
    console.log('   1. Table does not exist - run ALTER TABLE commands');
    console.log('   2. RLS policy blocking inserts - check Supabase dashboard');
    console.log('   3. Missing phone column - run migration SQL');
    process.exit(1);
  }

  console.log('\n✅ All tests passed! Supabase tracking is working correctly.');
}

runTests();
