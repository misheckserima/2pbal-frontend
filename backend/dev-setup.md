# Backend Development Setup

## Required Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Database (Neon PostgreSQL)
NEON_DATABASE_URL=your_neon_database_url_here
DATABASE_URL=your_database_url_here

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe (Payments)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Session Secret
SESSION_SECRET=your_session_secret_here

# Node Environment
NODE_ENV=development
```

## Quick Development Setup

For development testing, you can temporarily modify the email service to skip the API key check:

1. Open `backend/email-service.ts`
2. Comment out or modify line 5-7 to allow development without email service
3. Run `npm run dev` in the backend directory

## Production Deployment

For production, make sure to set all environment variables in your Vercel dashboard.
