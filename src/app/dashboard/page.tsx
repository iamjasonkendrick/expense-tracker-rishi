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

  const totalExpenses = expenses.reduce((sum, exp) => {
    return sum + parseFloat(exp.totalAmount || "0");
  }, 0);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (res.ok) setExpenses(await res.json());
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    }
  };

  useEffect(() => {
    if (session) fetchExpenses();
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
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-emerald-400">₹{totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-slate-900">{expenses.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Form */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Quick Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddExpense} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" type="number" placeholder="0.00" 
                value={amount} onChange={(e) => setAmount(e.target.value)} required 
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" type="text" placeholder="What did you buy?" 
                value={description} onChange={(e) => setDescription(e.target.value)} required 
              />
            </div>
            <Button type="submit" disabled={loading} className="h-10 bg-emerald-600 hover:bg-emerald-700 md:w-40">
              {loading ? "Adding..." : "Add Expense"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Expenses List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No expenses yet. Add your first one above!</p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-semibold text-slate-900">{expense.description || "No description"}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(expense.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-bold text-lg text-red-500">-₹{expense.totalAmount}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}