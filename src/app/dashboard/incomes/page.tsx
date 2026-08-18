"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

interface Income {
  id: string;
  amount: string;
  description: string | null;
  createdAt: string;
}

export default function IncomesPage() {
  const { data: session } = authClient.useSession();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [incomes, setIncomes] = useState<Income[]>([]);

  const fetchIncomes = async () => {
    try {
      const res = await fetch("/api/incomes");
      if (res.ok) setIncomes(await res.json());
    } catch (error) {
      console.error("Failed to fetch incomes", error);
    }
  };

  useEffect(() => {
    if (session) fetchIncomes();
  }, [session]);

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/incomes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description }),
    });
    setLoading(false);
    setAmount("");
    setDescription("");
    fetchIncomes();
  };

  if (!session) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Incomes</h1>
        <p className="text-slate-500">Track your earnings and revenue streams.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Income</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddIncome} className="flex gap-4 items-end">
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
                placeholder="e.g., Monthly Salary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-10 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? "Adding..." : "Add Income"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income History</CardTitle>
        </CardHeader>
        <CardContent>
          {incomes.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No incomes recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {incomes.map((income) => (
                <div
                  key={income.id}
                  className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">{income.description || "Income"}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(income.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-bold text-lg text-emerald-600">+₹{income.amount}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
