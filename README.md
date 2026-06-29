# Maharashtra Adventures

A full-stack platform to discover, compare, and book adventure experiences across destinations in Maharashtra, India.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: NextAuth.js
- **Payments**: Razorpay
- **AI Chatbot**: Gemini API
- **Image Uploads**: Cloudinary
- **Email**: Resend
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (for PostgreSQL database)
- Razorpay account (for payments)
- Google Cloud account (for OAuth & Maps - optional)
- Cloudinary account (for image uploads - optional)
- Resend account (for emails - optional)
- Gemini API key (for AI chatbot - optional)

## 🛠️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/HariniGS-0307/Tourism_visit.git
   cd Tourism_visit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values (see Environment Variables section below).

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3006](http://localhost:3006) in your browser.

## 🌐 Deployment on Vercel

### Step 1: Push to GitHub

Make sure your code is pushed to the GitHub repository:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `HariniGS-0307/Tourism_visit`

### Step 3: Configure Environment Variables

In Vercel project settings → Environment Variables, add the following:

**Required Variables:**
- `DATABASE_URL` - Your Supabase PostgreSQL connection string (Transaction mode, port 6543)
- `DIRECT_URL` - Your Supabase PostgreSQL connection string (Direct mode, port 5432)
- `NEXTAUTH_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `NEXTAUTH_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

**Optional but Recommended:**
- `GOOGLE_CLIENT_ID` - From Google Cloud Console (for "Sign in with Google")
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `RAZORPAY_KEY_ID` - From Razorpay Dashboard
- `RAZORPAY_KEY_SECRET` - From Razorpay Dashboard
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Same as RAZORPAY_KEY_ID
- `RAZORPAY_WEBHOOK_SECRET` - From Razorpay Webhooks
- `GEMINI_API_KEY` - From Google AI Studio
- `CLOUDINARY_URL` - From Cloudinary Dashboard
- `RESEND_API_KEY` - From Resend Dashboard
- `OPENWEATHER_API_KEY` - From OpenWeatherMap
- `GOOGLE_MAPS_API_KEY` - From Google Cloud Console

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will automatically build and deploy your app
3. Once deployed, update `NEXTAUTH_URL` in environment variables to your actual deployment URL

### Step 5: Database Setup on Production

After deployment, you need to set up your production database:

```bash
# Get your database URL from Vercel environment variables
# Then run:
npx prisma db push
```

## 🔑 Environment Variables

### Database (Supabase)
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### NextAuth
```
NEXTAUTH_SECRET="your_nextauth_secret_min_32_chars"
NEXTAUTH_URL="https://your-app.vercel.app"
```

### Google OAuth (Optional)
```
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### Razorpay Payments
```
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
```

### Gemini AI
```
GEMINI_API_KEY="AIzaSy..."
```

### Cloudinary
```
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
```

### Resend Email
```
RESEND_API_KEY="re_..."
```

### OpenWeatherMap
```
OPENWEATHER_API_KEY="your_openweather_api_key"
```

### Google Maps
```
GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable components
├── lib/             # Utility functions and configurations
├── hooks/           # Custom React hooks
└── middleware.ts    # Next.js middleware
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📝 License

This project is licensed under the MIT License.
