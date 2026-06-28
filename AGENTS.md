# Standing Rules

PROJECT: "Maharashtra Adventures" — a full-stack platform to discover, compare, and book adventure experiences (trekking, camping, water sports, etc.) across destinations in Maharashtra, India. Operators list and fulfil experiences; users discover, compare, and book them online with secure payment.

STACK: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM, PostgreSQL (Supabase), NextAuth.js for auth, Razorpay for payments, Gemini API for the AI chatbot, Cloudinary for image uploads, Resend for email, deployed on Vercel.

RULES:
- Use TypeScript everywhere, strict mode on. No `any` unless unavoidable.
- One feature per file. Keep components small and composable.
- All database access goes through src/server/services, never call Prisma directly from a page or API route.
- Validate every API input with zod schemas in src/lib/validators.
- Never hardcode secrets — always read from process.env and update .env.example.
- Every page must be mobile-responsive (test at 375px, 768px, 1280px widths) and pass a Lighthouse performance score above 85.
- Use Tailwind utility classes only; no inline styles.
- Write at least one test for every API route that touches the database.
- After finishing any module, run the app, use the built-in browser agent to click through the new flow, and attach a verification walkthrough before marking it done.
- Commit working code in small, logical commits with clear messages.
- Ask me for approval before running destructive terminal commands (drop table, force push, rm -rf) or before finalizing a payment-integration task.
