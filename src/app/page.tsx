"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Wallet, ArrowRight, Check, ChevronDown, Menu, X,
  Shield, Zap, Globe, Receipt, TrendingUp, BarChart3,
  Calendar, Users, Sun, Sparkles, PieChart, Bell,
} from "lucide-react";
import BrandLogo from "@/components/brand-logo";

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const features = [
    { icon: Receipt, title: "Expense Tracking", desc: "Log every expense with categories, dates, and descriptions. See where your money goes at a glance.", iconBg: "bg-expense-muted", iconColor: "text-expense" },
    { icon: TrendingUp, title: "Income Management", desc: "Track all income sources — salary, freelance, investments. Know exactly what's coming in.", iconBg: "bg-income-muted", iconColor: "text-income" },
    { icon: BarChart3, title: "Visual Analytics", desc: "Beautiful charts showing spending trends, category breakdowns, and monthly comparisons.", iconBg: "bg-primary/10", iconColor: "text-primary" },
    { icon: Calendar, title: "Calendar View", desc: "See your expenses mapped across a calendar. Click any date to view that day's transactions.", iconBg: "bg-chart-2/10", iconColor: "text-chart-2" },
    { icon: Users, title: "Shared Expenses", desc: "Split bills with friends and family. Invite members, accept or reject, and track who owes whom.", iconBg: "bg-chart-4/10", iconColor: "text-chart-4" },
    { icon: Sun, title: "Theme Customization", desc: "Light mode, dark mode, or system preference. Customize colors to match your style.", iconBg: "bg-chart-3/10", iconColor: "text-chart-3" },
  ];

  const steps = [
    { num: "1", title: "Create Your Account", desc: "Sign up with email or Google in under 30 seconds. No credit card required. Completely free during beta." },
    { num: "2", title: "Add Your Transactions", desc: "Log your expenses and incomes with simple forms. Categorize them for better insights." },
    { num: "3", title: "Track & Analyze", desc: "View beautiful charts, set budgets, split bills with friends, and take control of your finances." },
  ];

  const pricingFeatures = [
    "Unlimited expense tracking",
    "Unlimited income tracking",
    "Visual charts & analytics",
    "Calendar view",
    "Shared expenses with friends",
    "Notifications & alerts",
    "Multi-currency support",
    "Light & dark theme",
    "CSV export",
    "Priority support during beta",
  ];

  const faqs = [
    { q: "Is Rupalytic really free?", a: "Yes! During the beta phase, all features are completely free with no limits. We may introduce premium plans later, but beta users will always get special benefits." },
    { q: "Is my financial data secure?", a: "Absolutely. Your data is encrypted in transit and at rest. We use industry-standard security practices and never share your data with third parties." },
    { q: "Can I use Rupalytic on my phone?", a: "Yes! Rupalytic is fully responsive and works beautifully on smartphones, tablets, and desktops. No app download required." },
    { q: "How does shared expenses work?", a: "You can create a shared expense, invite friends by email, and they can accept or reject the invitation. Everyone can see who paid what and who owes whom." },
    { q: "Can I export my data?", a: "Yes! You can export your expenses and incomes as CSV files. PDF reports are coming soon." },
    { q: "What currencies are supported?", a: "Currently we support INR (₹), USD ($), EUR (€), and GBP (£). More currencies will be added based on user demand." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===== NAVIGATION (matches dark sidebar) ===== */}
      <nav className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-border shadow-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" >
            <BrandLogo onDark size="lg" /> 
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm px-4 py-2 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-medium transition-colors">
              Get Started Free
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-sidebar border-t border-sidebar-border px-6 py-4 space-y-3">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-sidebar-foreground/80 hover:text-sidebar-foreground py-1">
                {l.label}
              </a>
            ))}
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-1">Log In</Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)} className="block bg-primary text-primary-foreground text-center px-5 py-2.5 rounded-lg font-medium">
              Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* ===== HERO (dark, with dashboard preview) ===== */}
      <section className="relative bg-sidebar text-sidebar-foreground overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-chart-2/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/25 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Free Beta · No Credit Card Required</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Master Your Money,
              <br />
              <span className="text-primary">Effortlessly.</span>
            </h1>
            <p className="mt-6 text-lg text-sidebar-foreground/70 max-w-xl leading-relaxed">
              Track expenses, monitor income, split bills with friends, and visualize your financial health — all in one beautifully simple dashboard.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3.5 rounded-xl text-base font-medium transition-all hover:shadow-lg hover:shadow-primary/25">
                Start Tracking Free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 border border-sidebar-border hover:border-sidebar-foreground/40 text-sidebar-foreground px-7 py-3.5 rounded-xl text-base font-medium transition-colors">
                View Dashboard
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-sidebar-foreground/60">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Secure & Private</span>
              <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Instant Setup</span>
              <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Multi-Currency</span>
            </div>
          </div>

          {/* Right: mock dashboard preview (the "picture") */}
          <div className="relative">
            <div className="rounded-2xl bg-card text-card-foreground border border-border shadow-modal overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-sm">My Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div className="w-7 h-7 rounded-full bg-muted" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-5">
                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="text-lg font-bold">₹24,500</p>
                  <p className="text-xs text-income flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3" /> +12%</p>
                </div>
                <div className="rounded-xl bg-income-muted p-3">
                  <p className="text-xs text-muted-foreground">Income</p>
                  <p className="text-lg font-bold text-income">₹60,000</p>
                </div>
                <div className="rounded-xl bg-expense-muted p-3">
                  <p className="text-xs text-muted-foreground">Expenses</p>
                  <p className="text-lg font-bold text-expense">₹35,500</p>
                </div>
              </div>

              <div className="px-5 pb-5">
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold">Monthly Overview</p>
                    <span className="text-xs text-muted-foreground">Last 6 months</span>
                  </div>
                  <div className="flex items-end gap-4 h-32">
                    {[
                      { inc: 55, exp: 35 },
                      { inc: 70, exp: 45 },
                      { inc: 48, exp: 30 },
                      { inc: 82, exp: 55 },
                      { inc: 60, exp: 40 },
                      { inc: 90, exp: 62 },
                    ].map((m, i) => (
                      <div key={i} className="flex-1 flex items-end justify-center gap-1">
                        <div className="w-2.5 bg-income rounded-t" style={{ height: `${m.inc}%` }} />
                        <div className="w-2.5 bg-expense rounded-t" style={{ height: `${m.exp}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 hidden sm:flex items-center gap-3 bg-card border border-border rounded-xl shadow-elevated px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-income-muted flex items-center justify-center">
                <PieChart className="h-5 w-5 text-income" />
              </div>
              <div>
                <p className="text-sm font-semibold">Spending Insights</p>
                <p className="text-xs text-muted-foreground">Updated in real time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES (light) ===== */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">Features</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Everything You Need to Manage Money</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful tools designed to make financial tracking simple, insightful, and even enjoyable.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-card transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}>
                  <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS (tinted for division) ===== */}
      <section id="how-it-works" className="py-20 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Up and Running in 3 Simple Steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center bg-card border border-border rounded-2xl p-8 shadow-soft">
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {s.num}
                </div>
                <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING (light) ===== */}
      <section id="pricing" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Free During Beta</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Every feature. No limits. No credit card. Just sign up and start tracking.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl border-2 border-primary bg-card shadow-elevated overflow-hidden">
              <div className="bg-primary/5 px-8 py-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Beta Plan</h3>
                    <p className="text-muted-foreground text-sm mt-1">Everything included, forever free during beta</p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold text-primary">₹0</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                </div>
              </div>
              <div className="px-8 py-8">
                <ul className="space-y-3">
                  {pricingFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-medium transition-all hover:shadow-lg hover:shadow-primary/25">
                  Start Free — No Credit Card <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ (tinted, accordion) ===== */}
      <section id="faq" className="py-20 bg-surface-muted">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="bg-card border border-border rounded-xl shadow-soft overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold pr-4">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-primary flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA (dark) ===== */}
      <section className="py-20 bg-sidebar text-sidebar-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Ready to Take Control of Your Finances?</h2>
          <p className="mt-4 text-sidebar-foreground/70 text-lg">
            Join thousands of users who are already mastering their money with Rupalytic.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-medium transition-all hover:shadow-lg hover:shadow-primary/25">
            Get Started — It's Free <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER (dark, matches sidebar) ===== */}
      <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <BrandLogo onDark size="sm" />
              </div>
              <p className="text-sidebar-foreground/60 text-sm leading-relaxed">
                Master your money, effortlessly. Track, analyze, and optimize your finances.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sidebar-foreground/60 hover:text-sidebar-foreground text-sm transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sidebar-foreground/60 hover:text-sidebar-foreground text-sm transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-sidebar-foreground/60 hover:text-sidebar-foreground text-sm transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-sidebar-foreground/60 hover:text-sidebar-foreground text-sm transition-colors">Log In</Link></li>
                <li><Link href="/signup" className="text-sidebar-foreground/60 hover:text-sidebar-foreground text-sm transition-colors">Sign Up</Link></li>
                <li><Link href="/reset-password" className="text-sidebar-foreground/60 hover:text-sidebar-foreground text-sm transition-colors">Reset Password</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><span className="text-sidebar-foreground/60 text-sm cursor-pointer hover:text-sidebar-foreground transition-colors">Privacy Policy</span></li>
                <li><span className="text-sidebar-foreground/60 text-sm cursor-pointer hover:text-sidebar-foreground transition-colors">Terms of Service</span></li>
                <li><span className="text-sidebar-foreground/60 text-sm cursor-pointer hover:text-sidebar-foreground transition-colors">Cookie Policy</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-sidebar-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sidebar-foreground/50 text-sm">© {new Date().getFullYear()} Rupalytic. All rights reserved.</p>
            <p className="text-sidebar-foreground/50 text-sm">Built with ❤️ by Rishi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}