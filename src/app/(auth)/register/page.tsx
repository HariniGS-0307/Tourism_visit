"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mountain, Mail, Lock, Eye, EyeOff, User } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const result = await res.json() as { message?: string };
        throw new Error(result.message || "Something went wrong");
      }
      router.push("/login?registered=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-emerald-950 via-gray-900 to-gray-950 px-4 py-16 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden opacity-20">
        <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path d="M0,120 L240,50 L480,90 L720,20 L960,60 L1200,30 L1440,80 L1440,120 Z" fill="#059669" />
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 hover:scale-105 transition-transform">
              <Mountain className="w-8 h-8 text-white" />
            </Link>
            <h1 className="text-2xl font-extrabold text-white">Create your account</h1>
            <p className="text-gray-400 text-sm mt-1">Join thousands of adventurers</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Aarav Sharma"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="At least 6 characters"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500">
            Are you an operator?{" "}
            <Link href="/operator-register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Register your business
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

