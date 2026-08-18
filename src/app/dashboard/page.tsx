"use client";

import { Activity, Calendar, DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AddExpenseModal from "@/components/modals/add-expense-modal";
import AddIncomeModal from "@/components/modals/add-income-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/contexts/currency-context";
import { authClient } from "@/lib/auth-client";
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

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const { currency } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [expRes, incRes] = await Promise.all([fetch("/api/expenses"), fetch("/api/incomes")]);
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
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.totalAmount || "0"), 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + parseFloat(inc.amount || "0"), 0);
  const balance = totalIncome - totalExpenses;
  const totalTransactions = expenses.length + incomes.length;
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  // Get current month data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses.filter((exp) => {
    const date = new Date(exp.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  const thisMonthIncome = incomes.filter((inc) => {
    const date = new Date(inc.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  const thisMonthExpenseTotal = thisMonthExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.totalAmount || "0"),
    0,
  );
  const thisMonthIncomeTotal = thisMonthIncome.reduce(
    (sum, inc) => sum + parseFloat(inc.amount || "0"),
    0,
  );

  // Prepare monthly trend data (last 6 months)
  const monthlyTrendData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentYear, currentMonth - (5 - i), 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthName = date.toLocaleDateString("en-US", { month: "short" });

    const monthExpenses = expenses
      .filter((exp) => {
        const expDate = new Date(exp.createdAt);
        return expDate.getMonth() === month && expDate.getFullYear() === year;
      })
      .reduce((sum, exp) => sum + parseFloat(exp.totalAmount || "0"), 0);

    const monthIncomes = incomes
      .filter((inc) => {
        const incDate = new Date(inc.createdAt);
        return incDate.getMonth() === month && incDate.getFullYear() === year;
      })
      .reduce((sum, inc) => sum + parseFloat(inc.amount || "0"), 0);

    return {
      month: monthName,
      expenses: monthExpenses,
      income: monthIncomes,
    };
  });

  // Category breakdown for pie chart
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with Modal Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Financial Overview</h1>
          <p className="text-slate-500">Track your income, expenses, and balance at a glance.</p>
        </div>
        <div className="flex gap-3">
          <AddIncomeModal onIncomeAdded={fetchData} />
          <AddExpenseModal onExpenseAdded={fetchData} />
        </div>
      </div>

      {/* Summary Cards - 6 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalIncome, currency)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" /> Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses, currency)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Wallet className="h-4 w-4" /> Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {formatCurrency(balance, currency)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Activity className="h-4 w-4" /> Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{totalTransactions}</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Avg Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(avgExpense, currency)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-teal-50 border-teal-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-teal-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-600">
              Income: {formatCurrency(thisMonthIncomeTotal, currency)}
            </p>
            <p className="text-sm text-red-600">
              Expense: {formatCurrency(thisMonthExpenseTotal, currency)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(value as number, currency),
                    name === "income" ? "Income" : "Expenses",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart: Income vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Income", amount: totalIncome },
                  { name: "Expenses", amount: totalExpenses },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number, currency), "Amount"]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart: Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value as number, currency), "Amount"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">
                No expense data to display. Add your first expense!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.slice(0, 5).map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900">{expense.description || "Expense"}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-bold text-red-600">
                  -{formatCurrency(parseFloat(expense.totalAmount || "0"), currency)}
                </p>
              </div>
            ))}
            {incomes.slice(0, 5).map((income) => (
              <div
                key={income.id}
                className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900">{income.description || "Income"}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(income.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-bold text-emerald-600">
                  +{formatCurrency(parseFloat(income.amount || "0"), currency)}
                </p>
              </div>
            ))}
            {expenses.length === 0 && incomes.length === 0 && (
              <p className="text-slate-500 text-center py-4">
                No transactions yet. Add your first income or expense!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
