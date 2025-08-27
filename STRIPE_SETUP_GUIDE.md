# Stripe Setup

How to get Stripe working for payments.

## Getting started

1. Go to stripe.com and make an account
2. Go to Developers > API keys in your dashboard  
3. Copy the test keys (they start with pk_test and sk_test)
4. Add them to your .env file:

```
STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...
STRIPE_SECRET_KEY=sk_test_51XYZ789...
```

5. Restart your server

## Testing payments

Use these fake credit card numbers:
- 4242 4242 4242 4242 - works
- 4000 0000 0000 0002 - gets declined

For expiry use any future date like 12/25
CVC can be any 3 numbers like 123
ZIP can be any 5 numbers like 12345

## Important

- Test keys don't charge real money
- Only use live keys when you're actually selling stuff
- Keep your secret key private obviously