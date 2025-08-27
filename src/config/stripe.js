import Stripe from 'stripe';

// Check if Stripe secret key is provided
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️  STRIPE_SECRET_KEY not found in environment variables.');
  console.warn('   Payment functionality will be disabled until Stripe keys are configured.');
  console.warn('   Please add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to your .env file.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  : null;

export default stripe;
