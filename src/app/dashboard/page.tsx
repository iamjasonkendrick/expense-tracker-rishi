"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Expense {
  id: string;
  totalAmount: string;
  description: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Calculate Total Expenses
  const totalExpenses = expenses.reduce((sum, exp) => {
    return sum + parseFloat(exp.totalAmount || "0");
  }, 0);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchExpenses();
    }
  }, [session]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description }),
    });
    
    setLoading(false);
    setAmount("");
    setDescription("");
    fetchExpenses();
  };

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, {session.user.name}!</p>
          </div>
          <Button variant="outline" onClick={() => authClient.signOut()}>
            Sign Out
          </Button>
        </div>

        {/* Total Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-emerald-600 text-white border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">₹{totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-slate-900">{expenses.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExpense} className="flex gap-4 items-end">
              <div className="space-y-2 flex-1">
                <Label htmlFor="amount">Amount</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  type="text" 
                  placeholder="What did you buy?" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" disabled={loading} className="h-10">
                {loading ? "Adding..." : "Add Expense"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No expenses yet. Add one above!</p>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-slate-100 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{expense.description || "No description"}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(expense.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold text-lg text-emerald-600">₹{expense.totalAmount}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}