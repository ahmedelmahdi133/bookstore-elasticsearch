# 📚 Modern Bookstore with React & Elasticsearch

A full-stack bookstore application with React frontend, Node.js backend, and Elasticsearch-powered search. Features user authentication, shopping cart, order management, and Stripe payments.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bookstore-with-elastic-search&env=MONGO_URI,JWT_SECRET,ELASTICSEARCH_NODE,SENDGRID_API_KEY,CLOUDINARY_CLOUD_NAME,STRIPE_SECRET_KEY&envDescription=Environment%20variables%20needed%20for%20the%20bookstore%20app)

## ✨ Features

- 🔐 **User Authentication** - JWT-based auth with signup, login, password reset
- 📚 **Book Management** - Browse, search, and view book details
- 🔍 **Smart Search** - Elasticsearch-powered search with filters
- 🛒 **Shopping Cart** - Add, remove, update quantities
- 💳 **Payment Processing** - Stripe integration for secure payments
- 📦 **Order Management** - Order history and tracking
- 📱 **Responsive Design** - Beautiful UI with Bootstrap 5
- 🚀 **Modern Stack** - React, Node.js, MongoDB, Elasticsearch

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Bootstrap 5 for styling
- Axios for API calls
- Context API for state management

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Elasticsearch for search
- Stripe for payments
- SendGrid for emails
- Cloudinary for file uploads

## 🚀 Quick Deploy to Vercel

### Option 1: One-Click Deploy
Click the "Deploy with Vercel" button above and follow the setup wizard.

### Option 2: Manual Deploy
1. **Clone and Setup**:
   ```bash
   git clone your-repo-url
   cd bookstore-with-elastic-search
   npm run install:all
   ```

2. **Deploy**:
   ```bash
   npm run deploy
   ```

3. **Configure Environment Variables**:
   - Copy variables from `environment-variables.txt`
   - Add them to your Vercel project settings
   - See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions

## 💻 Local Development

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Elasticsearch instance
- Environment variables (see `environment-variables.txt`)

### Setup

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Environment Variables**:
   ```bash
   # Create .env file in root directory
   cp environment-variables.txt .env
   # Edit .env with your actual values

   # Create .env file in frontend directory  
   echo "VITE_API_URL=http://localhost:5000" > frontend/.env
   ```

3. **Start Development Servers**:
   ```bash
   # Backend (Terminal 1)
   npm run dev:backend

   # Frontend (Terminal 2) 
   npm run dev:frontend
   ```

4. **Access Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
bookstore-with-elastic-search/
├── api/                     # Vercel serverless functions
│   └── index.js
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API services
│   ├── dist/               # Built frontend (generated)
│   └── package.json
├── src/                    # Backend source
│   ├── config/            # Database & service configs
│   ├── controllers/       # Route handlers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── services/          # Business logic
├── vercel.json            # Vercel deployment config
└── package.json           # Root dependencies
```

## 🔧 Available Scripts

```bash
# Development
npm run dev:backend          # Start backend server
npm run dev:frontend         # Start frontend dev server
npm run dev                  # Start backend only

# Building
npm run build               # Build frontend for production
npm run install:all         # Install all dependencies

# Deployment
npm run deploy              # Deploy to Vercel
npm run vercel-build        # Vercel build command
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Books
- `GET /api/books` - Get all books
- `GET /api/books/search?q=query` - Search books
- `POST /api/books` - Add new book (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:bookId` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders` - Create new order

### Payments
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent

## 🔐 Environment Variables

See `environment-variables.txt` for the complete list of required environment variables.

Key variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `ELASTICSEARCH_NODE` - Elasticsearch endpoint
- `STRIPE_SECRET_KEY` - Stripe secret key
- `SENDGRID_API_KEY` - SendGrid API key

## 📖 Deployment Guide

For detailed deployment instructions, see `VERCEL_DEPLOYMENT_GUIDE.md`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

- 📚 Check `VERCEL_DEPLOYMENT_GUIDE.md` for deployment help
- 🐛 Open an issue for bug reports
- 💡 Submit feature requests via issues
- 📧 Contact support for urgent issues

---

Made with ❤️ by [Your Name]