"use client";

import { useState } from "react";
import Link from "next/link";
import { Mountain, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-emerald-950 via-gray-900 to-gray-950 px-4 py-16 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
              <Mountain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Forgot Password?</h1>
            <p className="text-gray-400 text-sm mt-1 text-center">
              No worries — we'll email you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-white font-bold text-lg">Check your inbox</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We sent a password reset link to <span className="text-emerald-400 font-semibold">{email}</span>.
                The link expires in 1 hour.
              </p>
              <p className="text-gray-500 text-xs">
                Didn't get it? Check spam or{" "}
                <button onClick={() => setSent(false)} className="text-emerald-400 hover:underline">
                  try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

