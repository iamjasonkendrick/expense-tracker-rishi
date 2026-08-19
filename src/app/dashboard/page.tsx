"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddExpenseModal from "@/components/modals/add-expense-modal";
import AddIncomeModal from "@/components/modals/add-income-modal";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  TrendingUp, TrendingDown, Wallet, Activity, Calendar,
  DollarSign, BarChart3, Receipt
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";
import { formatCurrency } from "@/lib/currency";

interface Expense {
  id: string;
  totalAmount: string;
  description: string | null;
  createdAt: string;
}

interface Income {
  id: string;
  amount: string;
  description: string | null;
  createdAt: string;
}

const CHART_COLORS = ["#6499c9", "#4da8a5", "#7fb88a", "#d4a96a", "#d48a7a", "#9a8ab8"];

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const { currency } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [expRes, incRes] = await Promise.all([
        fetch("/api/expenses"),
        fetch("/api/incomes"),
      ]);
      if (expRes.ok) setExpenses(await expRes.json());
      if (incRes.ok) setIncomes(await incRes.json());
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }, []);

  useEffect(() => {
    if (session) fetchData();
  }, [session, fetchData]);

  if (!session) {
    return <div className="flex items-center justify-center h-full text-foreground">Loading...</div>;
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.totalAmount || "0"), 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + parseFloat(inc.amount || "0"), 0);
  const balance = totalIncome - totalExpenses;
  const totalTransactions = expenses.length + incomes.length;
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenseTotal = expenses
    .filter((exp) => {
      const d = new Date(exp.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + parseFloat(exp.totalAmount || "0"), 0);
  const thisMonthIncomeTotal = incomes
    .filter((inc) => {
      const d = new Date(inc.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, inc) => sum + parseFloat(inc.amount || "0"), 0);

  const monthlyTrendData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentYear, currentMonth - (5 - i), 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthName = date.toLocaleDateString("en-US", { month: "short" });

    const monthExpenses = expenses
      .filter((exp) => {
        const d = new Date(exp.createdAt);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, exp) => sum + parseFloat(exp.totalAmount || "0"), 0);
    const monthIncomes = incomes
      .filter((inc) => {
        const d = new Date(inc.createdAt);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, inc) => sum + parseFloat(inc.amount || "0"), 0);

    return { month: monthName, expenses: monthExpenses, income: monthIncomes };
  });

  const categoryData = expenses
    .reduce((acc: { name: string; value: number }[], exp) => {
      const category = exp.description || "Other";
      const existing = acc.find((item) => item.name === category);
      if (existing) {
        existing.value += parseFloat(exp.totalAmount || "0");
      } else {
        acc.push({ name: category, value: parseFloat(exp.totalAmount || "0") });
      }
      return acc;
    }, [])
    .slice(0, 6);

  const recentTransactions = [
    ...expenses.slice(0, 5).map((e) => ({ ...e, type: "expense" as const })),
    ...incomes.slice(0, 5).map((i) => ({ ...i, type: "income" as const })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ===== HERO HEADER ===== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary-600 dark:from-primary/80 dark:via-primary/90 dark:to-primary p-8 text-primary-foreground shadow-elevated">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8" />
              Financial Overview
            </h1>
            <p className="text-primary-foreground/80 mt-2">
              Track your income, expenses, and balance at a glance.
            </p>
          </div>
          <div className="flex gap-3">
            <AddIncomeModal onIncomeAdded={fetchData} />
            <AddExpenseModal onExpenseAdded={fetchData} />
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 right-32 w-32 h-32 bg-white/10 rounded-full translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-white/5 rounded-full translate-y-1/3"></div>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Income */}
        <Card className="border-l-4 border-l-income shadow-soft hover:shadow-card transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-income" /> Total Income
                </p>
                <p className="text-2xl font-bold text-income mt-2">
                  {formatCurrency(totalIncome, currency)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-income-muted flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-income" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="border-l-4 border-l-expense shadow-soft hover:shadow-card transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-expense" /> Total Expenses
                </p>
                <p className="text-2xl font-bold text-expense mt-2">
                  {formatCurrency(totalExpenses, currency)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-expense-muted flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-expense" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balance */}
        <Card className="border-l-4 border-l-primary shadow-soft hover:shadow-card transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Wallet className="h-3 w-3 text-primary" /> Balance
                </p>
                <p className={`text-2xl font-bold mt-2 ${balance >= 0 ? "text-primary" : "text-expense"}`}>
                  {formatCurrency(balance, currency)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Count */}
        <Card className="border-l-4 border-l-chart-2 shadow-soft hover:shadow-card transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3 text-chart-2" /> Transactions
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">{totalTransactions}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg Expense */}
        <Card className="border-l-4 border-l-chart-4 shadow-soft hover:shadow-card transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-chart-4" /> Avg Expense
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {formatCurrency(avgExpense, currency)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-chart-4/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card className="border-l-4 border-l-chart-3 shadow-soft hover:shadow-card transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-chart-3" /> This Month
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-income font-medium">
                    Income: {formatCurrency(thisMonthIncomeTotal, currency)}
                  </p>
                  <p className="text-sm text-expense font-medium">
                    Expense: {formatCurrency(thisMonthExpenseTotal, currency)}
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-chart-3/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== CHARTS SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Line Chart */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis className="text-xs" tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(value as number, currency),
                    name === "income" ? "Income" : "Expenses",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#4da8a5" strokeWidth={2.5} name="Income" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="expenses" stroke="#d48a7a" strokeWidth={2.5} name="Expenses" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Income vs Expenses Bar Chart */}
        <Card className="shadow-soft">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="h-5 w-5 text-primary" />
              Income vs Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Income", amount: totalIncome, fill: "#4da8a5" },
                  { name: "Expenses", amount: totalExpenses, fill: "#d48a7a" },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number, currency), "Amount"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown Pie Chart */}
        <Card className="shadow-soft">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Receipt className="h-5 w-5 text-primary" />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value as number, currency), "Amount"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <Receipt className="h-12 w-12 mb-3 opacity-50" />
                <p className="font-medium">No expense data</p>
                <p className="text-sm mt-1">Add your first expense to see the breakdown</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ===== RECENT TRANSACTIONS ===== */}
      <Card className="shadow-soft overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="flex items-center justify-between text-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Transactions
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              Last {recentTransactions.length} transactions
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((tx) => {
                const isExpense = tx.type === "expense";
                const amount = isExpense
                  ? parseFloat((tx as Expense).totalAmount || "0")
                  : parseFloat((tx as Income).amount || "0");
                const description = tx.description || (isExpense ? "Expense" : "Income");

                return (
                  <div
                    key={tx.id}
                    className={`flex justify-between items-center p-4 rounded-lg border transition-colors ${
                      isExpense
                        ? "bg-expense-muted/50 border-expense/20 hover:bg-expense-muted"
                        : "bg-income-muted/50 border-income/20 hover:bg-income-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isExpense ? "bg-expense/20" : "bg-income/20"
                        }`}
                      >
                        {isExpense ? (
                          <TrendingDown className={`h-5 w-5 text-expense`} />
                        ) : (
                          <TrendingUp className={`h-5 w-5 text-income`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold text-lg ${isExpense ? "text-expense" : "text-income"}`}>
                      {isExpense ? "-" : "+"}
                      {formatCurrency(amount, currency)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Receipt className="h-12 w-12 mb-3 opacity-50" />
              <p className="font-medium">No transactions yet</p>
              <p className="text-sm mt-1">Add your first income or expense to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}