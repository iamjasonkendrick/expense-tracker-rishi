"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

interface Expense {
  id: string;
  totalAmount: string;
  description: string | null;
  expenseDate: string;
  createdAt: string;
}

export default function CalendarPage() {
  const { data: session } = authClient.useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch expenses
  useEffect(() => {
    if (session) {
      fetch("/api/expenses")
        .then((res) => res.json())
        .then((data) => setExpenses(data))
        .catch((err) => console.error("Failed to fetch expenses", err));
    }
  }, [session]);

  // Get year and month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Get total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get month name
  const monthName = currentDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get expenses for a specific day
  const getExpensesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return expenses.filter((exp) => {
      const expDate = exp.expenseDate
        ? exp.expenseDate.substring(0, 10)
        : exp.createdAt.substring(0, 10);
      return expDate === dateStr;
    });
  };

  // Calculate total for a day
  const getDayTotal = (day: number) => {
    const dayExpenses = getExpensesForDay(day);
    return dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.totalAmount || "0"), 0);
  };

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-24"></div>);
  }

  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayExpenses = getExpensesForDay(day);
    const dayTotal = getDayTotal(day);
    const isToday =
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    calendarDays.push(
      <div
        key={day}
        className={`h-24 border border-slate-200 rounded-lg p-2 bg-white hover:shadow-md transition-shadow ${isToday ? "ring-2 ring-emerald-500" : ""}`}
      >
        <div className="flex justify-between items-start">
          <span
            className={`text-sm font-medium ${isToday ? "text-emerald-600 font-bold" : "text-slate-700"}`}
          >
            {day}
          </span>
          {dayTotal > 0 && (
            <span className="text-xs font-semibold text-red-500">₹{dayTotal.toFixed(0)}</span>
          )}
        </div>

        {/* Show up to 2 expenses per day */}
        <div className="mt-1 space-y-1">
          {dayExpenses.slice(0, 2).map((exp) => (
            <div
              key={exp.id}
              className="text-xs bg-red-50 text-red-700 px-1 py-0.5 rounded truncate"
            >
              {exp.description || "Expense"}
            </div>
          ))}
          {dayExpenses.length > 2 && (
            <div className="text-xs text-slate-400">+{dayExpenses.length - 2} more</div>
          )}
        </div>
      </div>,
    );
  }

  if (!session) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendar View</h1>
          <p className="text-slate-500">See your expenses organized by date</p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={prevMonth} className="w-10 h-10 p-0">
            ←
          </Button>
          <span className="text-lg font-semibold text-slate-900 min-w-[180px] text-center">
            {monthName}
          </span>
          <Button variant="outline" onClick={nextMonth} className="w-10 h-10 p-0">
            →
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-slate-700">{monthName}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">{calendarDays}</div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Total This Month</p>
            <p className="text-2xl font-bold text-red-600">
              ₹
              {expenses
                .filter((exp) => {
                  const d = new Date(exp.expenseDate || exp.createdAt);
                  return d.getMonth() === month && d.getFullYear() === year;
                })
                .reduce((sum, exp) => sum + parseFloat(exp.totalAmount || "0"), 0)
                .toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Transactions This Month</p>
            <p className="text-2xl font-bold text-slate-900">
              {
                expenses.filter((exp) => {
                  const d = new Date(exp.expenseDate || exp.createdAt);
                  return d.getMonth() === month && d.getFullYear() === year;
                }).length
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Average Per Day</p>
            <p className="text-2xl font-bold text-emerald-600">
              ₹
              {(
                expenses
                  .filter((exp) => {
                    const d = new Date(exp.expenseDate || exp.createdAt);
                    return d.getMonth() === month && d.getFullYear() === year;
                  })
                  .reduce((sum, exp) => sum + parseFloat(exp.totalAmount || "0"), 0) /
                Math.max(daysInMonth, 1)
              ).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
