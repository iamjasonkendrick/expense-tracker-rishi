"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [username, setUsername] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Handle Sign Out with redirect to Home page
  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    router.push("/");
  };

  // Handle Save Settings (UI only for now)
  const handleSave = async () => {
    setSaving(true);
    // In Phase 2, this will connect to an API endpoint to update the database
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  if (!session) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your Rupalytic account preferences.</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account details and public profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{session.user.name}</p>
              <p className="text-sm text-slate-500">{session.user.email}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex gap-2">
                <Input 
                  id="username" 
                  placeholder="e.g., rupalytic_pro" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button variant="outline" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Change"}
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                Security Rule: You can only change your username 2 times per day.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={session.user.email || ""} 
                disabled 
                className="bg-slate-50 text-slate-500"
              />
              <p className="text-xs text-slate-400">Email cannot be changed for security reasons.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Base Currency</Label>
              <select 
                id="currency"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR">INR - Indian Rupee (₹)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
              </select>
            </div>

            <Button 
              className="bg-slate-900 hover:bg-slate-800 mt-4" 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-slate-600">Sign out of your Rupalytic account on this device.</p>
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}