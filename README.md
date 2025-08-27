# Bookstore App

This is my bookstore project I built for learning Node.js and Elasticsearch. It's a web app where you can browse books, add them to cart, and buy them.

## What it does

- Book browsing and searching (using Elasticsearch which is pretty cool)
- User signup/login 
- Shopping cart
- Payment with Stripe
- Admin stuff for managing books
- Email notifications

## Tech stack

- Node.js + Express
- MongoDB for database
- Elasticsearch for search
- EJS for templates
- Bootstrap CSS
- Cloudinary for images
- Stripe for payments
- SendGrid for emails

## Running it

1. Clone this repo
2. `npm install`
3. Create `.env` file with these variables:

```
MONGO_URI=mongodb://localhost:27017/bookstore
ELASTICSEARCH_URL=http://localhost:9200
SESSION_SECRET=somesecretkey
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=test@example.com
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

4. Make sure MongoDB and Elasticsearch are running
5. `npm start`
6. Go to http://localhost:5000

## How to use

Just go to the site, make an account, browse books and buy stuff. If you want to add books you need admin access (set role to 'admin' in the database).

## File structure

```
src/
├── app.js - main server file
├── config/ - database connections
├── controllers/ - business logic
├── models/ - mongoose schemas
├── routes/ - express routes
├── views/ - ejs templates
└── middleware/ - auth stuff
```

## Notes

- Make sure to set up all the external services (MongoDB, Elasticsearch, etc.)
- The search falls back to MongoDB if Elasticsearch is down
- Payment is in test mode by default
- Check VERCEL_DEPLOYMENT_GUIDE.md for deployment help

## Issues

If something breaks check the console logs. Make sure all your environment variables are set correctly.