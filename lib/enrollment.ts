// Enrollment status configuration
// Set this to false when enrollment is open
// When CAMPAIGN_ACTIVE is true in campaign.ts, this should be false
export const ENROLLMENT_CLOSED = false

// The URL to redirect to when enrollment is closed
export const CLOSED_URL = '/closed'

// Helper function to get the checkout URL based on enrollment status
export function getCheckoutUrl(): string {
  return ENROLLMENT_CLOSED ? CLOSED_URL : '/checkout-v2'
}
