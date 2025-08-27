# Vercel Deployment Guide

Quick guide to deploy this bookstore app on Vercel.

## What you need

External services:
- MongoDB Atlas (database)
- Elasticsearch Cloud (search)
- Cloudinary (images)
- SendGrid (emails)
- Stripe (payments)

## Steps

1. Push code to GitHub

2. Go to vercel.com and import your GitHub repo

3. Vercel will auto-detect it's a Node.js project

4. Set environment variables in Vercel dashboard:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/bookstore
ELASTICSEARCH_URL=https://your-cluster.es.cloud.elastic.co:9243
SESSION_SECRET=your-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
SENDGRID_API_KEY=SG.your-sendgrid-key
FROM_EMAIL=noreply@yourdomain.com
STRIPE_SECRET_KEY=sk_test_or_live_key
STRIPE_PUBLISHABLE_KEY=pk_test_or_live_key
```

5. Deploy!

## Setting up services

### MongoDB Atlas
- Create cluster, get connection string
- Set network access to 0.0.0.0/0

### Elasticsearch Cloud
- Create deployment, copy endpoint URL

### Others
- Cloudinary: Get keys from dashboard
- SendGrid: Verify email, create API key
- Stripe: Get API keys from dashboard

## Notes

- Vercel functions timeout after 30 seconds (configurable)
- Sessions are stored in MongoDB (not in memory)
- All file uploads go to Cloudinary
- Test everything after deployment

## Troubleshooting

- Check function logs in Vercel dashboard
- Make sure all env vars are set
- Verify external services are running
