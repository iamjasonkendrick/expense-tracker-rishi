"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/contexts/currency-context";
import { useTheme } from "@/contexts/theme-context";
import { CurrencyCode } from "@/lib/currency";
import { User, Palette, Settings, Shield, LogOut, Moon, Sun, Monitor, Check } from "lucide-react";

type SettingsTab = "profile" | "appearance" | "general" | "security";
type ThemeOption = "light" | "dark" | "system";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { currency, setCurrency } = useCurrency();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
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
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
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

  const themeOptions: { value: ThemeOption; label: string; description: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", description: "Always use light mode", icon: Sun },
    { value: "dark", label: "Dark", description: "Always use dark mode", icon: Moon },
    { value: "system", label: "System", description: "Match your device settings", icon: Monitor },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your Rupalytic account preferences.</p>
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
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
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
                <CardTitle className="text-foreground">Profile Information</CardTitle>
                <CardDescription>Update your account details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{session.user.name}</p>
                    <p className="text-sm text-muted-foreground">{session.user.email}</p>
                    <Badge variant="secondary" className="mt-1">Free Plan</Badge>
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
                        className="bg-background"
                      />
                      <Button variant="outline" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Change"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">You can change your username up to 2 times per day.</p>
                  </div>
                  {savedMessage && (
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm text-primary font-medium">Settings saved successfully!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Appearance</CardTitle>
                <CardDescription>Customize how Rupalytic looks. Changes are saved automatically to your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium text-foreground">Theme Mode</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = theme === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleThemeChange(option.value)}
                          className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                            isActive
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-primary/30 hover:bg-muted/50"
                          }`}
                        >
                          {isActive && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                          <Icon className={`h-6 w-6 mb-3 ${
                            option.value === "light" ? "text-amber-500" :
                            option.value === "dark" ? "text-slate-600 dark:text-slate-300" :
                            "text-blue-500"
                          }`} />
                          <p className="text-sm font-semibold text-foreground">{option.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      💡 Your theme preference is saved to your account and will sync across all devices.
                      Currently active: <strong className="text-foreground">{theme === "system" ? "System (auto)" : theme.charAt(0).toUpperCase() + theme.slice(1)}</strong>
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Compact Mode</p>
                      <p className="text-sm text-muted-foreground">Reduce spacing for denser layouts</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Animations</p>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
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
                <CardTitle className="text-foreground">General Settings</CardTitle>
                <CardDescription>Configure your default preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Base Currency</Label>
                  <select
                    id="currency"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  >
                    <option value="INR">INR - Indian Rupee (₹)</option>
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email alerts for important updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Weekly Reports</p>
                      <p className="text-sm text-muted-foreground">Get a weekly summary of your spending</p>
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
                  <CardTitle className="text-foreground">Password</CardTitle>
                  <CardDescription>Change your account password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" className="bg-background" />
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Update Password</Button>
                </CardContent>
              </Card>

              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Sign Out</p>
                      <p className="text-sm text-muted-foreground">Sign out of Rupalytic on this device</p>
                    </div>
                    <Button variant="destructive" onClick={handleSignOut} disabled={signingOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {signingOut ? "Signing out..." : "Sign Out"}
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