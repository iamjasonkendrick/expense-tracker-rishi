"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import BrandLogo from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
  Shield, TrendingUp, Globe,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(error.message || "Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    setGoogleLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email above first, then click this.");
      return;
    }
    setLoading(true);
    setError("");

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      setError("Could not send reset email: " + error.message);
    } else {
      setError("");
      alert("Reset link sent. Check your inbox and spam folder.");
    }
    setLoading(false);
  };

  const points = [
    { icon: Shield, text: "Secure, private tracking" },
    { icon: TrendingUp, text: "Clear income & expense insight" },
    { icon: Globe, text: "Multi-currency support" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* ===== LEFT PANEL (dark blue, hidden on mobile) ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-14">
        {/* calm deep-blue gradient, not flat */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e1a2b] via-[#132841] to-[#1c3a5a]" />
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-chart-2/10 rounded-full blur-3xl" />

        {/* Logo (bigger, on dark) */}
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <BrandLogo onDark size="xl" />
          </Link>
        </div>

        {/* Tagline + a little info */}
        <div className="relative z-10 space-y-10 max-w-md">
          <div>
            <h1 className="text-4xl xl:text-5xl font-heading font-bold text-white leading-tight">
              Master your money,
              <span className="block text-primary mt-2">effortlessly.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300/80 leading-relaxed">
              Track spending, monitor income, and understand your finances in one calm, simple place.
            </p>
          </div>

          <ul className="space-y-5">
            {points.map((p) => (
              <li key={p.text} className="flex items-center gap-4 text-slate-200/90">
                <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <p.icon className="h-5 w-5 text-primary" />
                </span>
                <span className="text-[15px]">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-slate-400/60">
          © {new Date().getFullYear()} Rupalytic
        </p>
      </div>

      {/* ===== RIGHT PANEL (form) ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12 bg-background">
        <div className="w-full max-w-[420px]">
          {/* mobile brand */}
          <div className="lg:hidden mb-10 flex justify-center">
            <Link href="/">
              <BrandLogo size="lg" />
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-heading font-bold text-foreground">Log in</h2>
            <p className="mt-2.5 text-muted-foreground">
              New to Rupalytic?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Create a free account
              </Link>
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 pl-12 pr-4 rounded-xl bg-card text-base focus-visible:ring-primary/40 focus-visible:border-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pl-12 pr-12 rounded-xl bg-card text-base focus-visible:ring-primary/40 focus-visible:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-expense-muted border border-expense/25">
                <p className="text-sm text-expense font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-9">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-xs text-muted-foreground uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full h-12 rounded-xl bg-card text-foreground text-base font-medium border-border hover:bg-muted transition-colors"
          >
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <p className="mt-9 text-center text-sm text-muted-foreground">
            Protected by secure authentication.{" "}
            <Link href="/" className="text-primary hover:underline">Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}