import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Rupa<span className="text-emerald-400">lytic</span>
          </h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <span className="px-4 py-1 rounded-full bg-emerald-900/50 text-emerald-400 text-sm font-medium border border-emerald-800 mb-6">
          Next-Gen Personal Finance
        </span>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Master Your Money, <br /> <span className="text-emerald-400">Effortlessly.</span>
        </h2>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl">
          Rupalytic is the most intuitive expense tracker. Track spending, manage incomes, and
          conquer your financial goals in real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-10 py-6 shadow-lg shadow-emerald-900/20"
            >
              Create Free Account
            </Button>
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">🔒 Secure Auth</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              Email & Google OAuth powered by Better Auth with encrypted sessions.
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                📊 Smart Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              Track expenses, log incomes, and view your financial health instantly.
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                ⚙️ Custom Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              Manage your profile, base currency, and account security preferences.
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-600 border-t border-slate-900 text-sm">
        © 2026 Rupalytic. Built with Next.js, Drizzle ORM, and Neon.
      </footer>
    </div>
  );
}
