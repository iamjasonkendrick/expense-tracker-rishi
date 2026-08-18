"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Calendar,
  Filter,
  Hash,
  Search,
  TrendingDown,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AddExpenseModal from "@/components/modals/add-expense-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrency } from "@/contexts/currency-context";
import { authClient } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/currency";

interface Expense {
  id: string;
  totalAmount: string;
  description: string | null;
  createdAt: string;
  expenseDate?: string;
}

type SortField = "date" | "amount";
type SortDirection = "asc" | "desc";

export default function ExpensesPage() {
  const { data: session } = authClient.useSession();
  const { currency } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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
    if (session) fetchExpenses();
  }, [session]);

  // Get unique years from expenses
  const availableYears = useMemo(() => {
    const years = new Set(
      expenses.map((exp) => new Date(exp.expenseDate || exp.createdAt).getFullYear().toString()),
    );
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [expenses]);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    if (searchQuery) {
      filtered = filtered.filter((exp) =>
        (exp.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter((exp) => {
        const date = new Date(exp.expenseDate || exp.createdAt);
        return date.getMonth().toString() === selectedMonth;
      });
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter((exp) => {
        const date = new Date(exp.expenseDate || exp.createdAt);
        return date.getFullYear().toString() === selectedYear;
      });
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        const dateA = new Date(a.expenseDate || a.createdAt).getTime();
        const dateB = new Date(b.expenseDate || b.createdAt).getTime();
        comparison = dateA - dateB;
      } else {
        comparison = parseFloat(a.totalAmount) - parseFloat(b.totalAmount);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [expenses, searchQuery, selectedMonth, selectedYear, sortField, sortDirection]);

  const filteredTotal = filteredExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.totalAmount || "0"),
    0,
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 inline" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 inline" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 inline" />
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Category color mapping
  const getCategoryColor = (description: string) => {
    const lower = description.toLowerCase();
    if (lower.includes("food") || lower.includes("lunch") || lower.includes("dinner")) {
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
    }
    if (lower.includes("travel") || lower.includes("taxi") || lower.includes("bus")) {
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    }
    if (lower.includes("shopping") || lower.includes("cloth")) {
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    }
    if (lower.includes("bill") || lower.includes("rent") || lower.includes("electricity")) {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
    }
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  };

  if (!session) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-rose-600 p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8" />
              Expense Ledger
            </h1>
            <p className="text-red-100 mt-2">
              Track every rupee you spend. Filter, search, and analyze your expenses.
            </p>
          </div>
          <AddExpenseModal onExpenseAdded={fetchExpenses} />
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 right-32 w-32 h-32 bg-white/10 rounded-full translate-y-1/2"></div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Total Transactions
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {filteredExpenses.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Hash className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> Total Spent
                </p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {formatCurrency(filteredTotal, currency)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" /> Avg Per Expense
                </p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {formatCurrency(
                    filteredExpenses.length > 0 ? filteredTotal / filteredExpenses.length : 0,
                    currency,
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Filters & Search
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Month Filter */}
            <select
              className="h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm w-full md:w-44 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="all">📅 All Months</option>
              {monthNames.map((month, index) => (
                <option key={month} value={index.toString()}>
                  {month}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              className="h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm w-full md:w-32 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">📆 All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            <Button
              variant="outline"
              className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => {
                setSearchQuery("");
                setSelectedMonth("all");
                setSelectedYear("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Calendar className="h-5 w-5 text-red-500" />
              Expense Records
            </span>
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
              {filteredExpenses.length} entries
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableHead className="w-[60px] text-center font-bold text-slate-600 dark:text-slate-300">
                      #
                    </TableHead>
                    <TableHead className="font-bold text-slate-600 dark:text-slate-300">
                      <button
                        className="flex items-center hover:text-red-600 transition-colors"
                        onClick={() => handleSort("date")}
                      >
                        Date {getSortIcon("date")}
                      </button>
                    </TableHead>
                    <TableHead className="font-bold text-slate-600 dark:text-slate-300">
                      Description
                    </TableHead>
                    <TableHead className="font-bold text-slate-600 dark:text-slate-300">
                      Category
                    </TableHead>
                    <TableHead className="text-right font-bold text-slate-600 dark:text-slate-300">
                      <button
                        className="flex items-center ml-auto hover:text-red-600 transition-colors"
                        onClick={() => handleSort("amount")}
                      >
                        Amount {getSortIcon("amount")}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense, index) => {
                    const expenseDate = new Date(expense.expenseDate || expense.createdAt);
                    return (
                      <TableRow
                        key={expense.id}
                        className={`hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors ${
                          index % 2 === 0
                            ? "bg-white dark:bg-slate-900"
                            : "bg-slate-50/50 dark:bg-slate-800/30"
                        }`}
                      >
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            {expenseDate.toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-slate-900 dark:text-white">
                          {expense.description || "Untitled Expense"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(expense.description || "")}`}
                          >
                            {expense.description?.split(" ")[0] || "General"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-red-600 dark:text-red-400 text-sm">
                            -{formatCurrency(parseFloat(expense.totalAmount || "0"), currency)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
                <Calendar className="h-10 w-10 text-red-400" />
              </div>
              <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                No expenses found
              </p>
              <p className="text-sm mt-1">Try adjusting your filters or add a new expense.</p>
            </div>
          )}
        </CardContent>

        {/* Table Footer */}
        {filteredExpenses.length > 0 && (
          <div className="border-t bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Showing {filteredExpenses.length} of {expenses.length} total expenses
              </p>
              <p className="text-lg font-bold text-red-600">
                Total: {formatCurrency(filteredTotal, currency)}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
