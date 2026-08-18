"use client";

import { LogOut, Monitor, Moon, Palette, Settings, Shield, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/contexts/currency-context";
import { authClient } from "@/lib/auth-client";
import type { CurrencyCode } from "@/lib/currency";

type SettingsTab = "profile" | "appearance" | "general" | "security";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { currency, setCurrency } = useCurrency();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [username, setUsername] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("rupalytic_theme") as "light" | "dark" | "system") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme: "light" | "dark" | "system") => {
    const root = document.documentElement;
    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else if (selectedTheme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("rupalytic_theme", newTheme);
    applyTheme(newTheme);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    router.push("/");
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 800);
  };

  if (!session) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const tabs = [
    { id: "profile" as SettingsTab, label: "Profile", icon: User },
    { id: "appearance" as SettingsTab, label: "Appearance", icon: Palette },
    { id: "general" as SettingsTab, label: "General", icon: Settings },
    { id: "security" as SettingsTab, label: "Security", icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your Rupalytic account preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-56 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details and public profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {session.user.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {session.user.email}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      Free Plan
                    </Badge>
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
                      You can change your username up to 2 times per day.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={session.user.email || ""}
                      disabled
                      className="bg-slate-50 dark:bg-slate-800 text-slate-500"
                    />
                    <p className="text-xs text-slate-400">
                      Email cannot be changed for security reasons.
                    </p>
                  </div>

                  <Button
                    className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how Rupalytic looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Theme</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "light"
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Sun className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                      <p className="text-sm font-medium text-center">Light</p>
                    </button>

                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "dark"
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Moon className="h-6 w-6 mx-auto mb-2 text-slate-600 dark:text-slate-300" />
                      <p className="text-sm font-medium text-center">Dark</p>
                    </button>

                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "system"
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Monitor className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm font-medium text-center">System</p>
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    "System" will automatically match your device's light/dark mode setting.
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Compact Mode</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Reduce spacing for denser layouts
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Animations</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Enable smooth transitions and effects
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your default preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Base Currency</Label>
                  <select
                    id="currency"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm dark:bg-slate-800"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  >
                    <option value="INR">INR - Indian Rupee (₹)</option>
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                  </select>
                  <p className="text-xs text-slate-400">
                    This currency will be used across all your financial displays.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm dark:bg-slate-800"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="fr">Français (French)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateformat">Date Format</Label>
                  <select
                    id="dateformat"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm dark:bg-slate-800"
                    defaultValue="dd/mm/yyyy"
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Email Notifications
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive email alerts for important updates
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Weekly Reports</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Get a weekly summary of your spending
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your account password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                  </div>
                  <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>Manage where you're logged in.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">This Device</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Current session • Active now
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                    >
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Sign Out</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Sign out of Rupalytic on this device
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleSignOut} disabled={signingOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {signingOut ? "Signing out..." : "Sign Out"}
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Delete Account</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
