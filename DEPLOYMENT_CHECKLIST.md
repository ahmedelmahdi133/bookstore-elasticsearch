# Vercel Deployment Checklist

Things to check before deploying to Vercel:

## External services
- [ ] MongoDB Atlas database
- [ ] Elasticsearch Cloud
- [ ] Cloudinary account
- [ ] SendGrid account
- [ ] Stripe account
- [ ] Vercel account

## Files ready
- [x] vercel.json config
- [x] api/index.js serverless entry point
- [x] app.js updated for serverless
- [x] package.json with vercel scripts

## Deploy process

1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables:
   - MONGO_URI
   - ELASTICSEARCH_URL
   - SESSION_SECRET
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - SENDGRID_API_KEY
   - FROM_EMAIL
   - STRIPE_SECRET_KEY
   - STRIPE_PUBLISHABLE_KEY
   - NODE_ENV=production

4. Deploy and test

## After deployment

Test these features:
- Home page loads
- User registration/login
- Book search works
- Cart functionality
- Image uploads
- Email notifications
- Payment processing
- Admin features

Check function logs if anything breaks.