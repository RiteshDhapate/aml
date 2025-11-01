"use client";

import type React from "react";

import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TokenFormProps {
  onSubmit: (name: string, dateOfBirth: string) => void;
}

export default function TokenForm({ onSubmit }: TokenFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [isValidating, setIsValidating] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );
  const months = [
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

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedMonth("");
    setSelectedDay("");
    setDateOfBirth(undefined);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setSelectedDay("");
    setDateOfBirth(undefined);
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    const monthIndex = months.indexOf(selectedMonth);
    const date = new Date(parseInt(selectedYear), monthIndex, parseInt(day));
    setDateOfBirth(date);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days =
    selectedYear && selectedMonth
      ? Array.from(
          {
            length: getDaysInMonth(
              parseInt(selectedYear),
              months.indexOf(selectedMonth)
            ),
          },
          (_, i) => i + 1
        )
      : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if date is complete
    if (!selectedYear || !selectedMonth || !selectedDay) {
      toast({
        title: "Validation Error",
        description:
          "Please select a complete date of birth (year, month, and day).",
        variant: "destructive",
      });
      return;
    }

    const today = new Date();
    if (dateOfBirth && dateOfBirth > today) {
      toast({
        title: "Validation Error",
        description: "Date of birth cannot be in the future.",
        variant: "destructive",
      });
      return;
    }

    let formattedDate = "";

    if (dateOfBirth) {
      formattedDate = format(dateOfBirth, "yyyy-MM-dd");
    }

    setIsValidating(true);
    await onSubmit(name.trim(), formattedDate);
    setIsValidating(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-xl shadow-2xl border border-border/50 p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold text-card-foreground mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AML Search Portal
            </h1>
            <p className="text-muted-foreground">
              Enter your info to search AML databases
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-card-foreground mb-2"
              >
                Name
              </label>
              <input
                id="name"
                value={name}
                required={true}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name..."
                className="w-full px-4 py-3 bg-background border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 disabled:opacity-50"
                disabled={isValidating}
              />
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-card-foreground mb-2"
              >
                Date of Birth
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={selectedYear}
                  onValueChange={handleYearChange}
                  disabled={isValidating}
                >
                  <SelectTrigger className="px-3 py-2 bg-background border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 disabled:opacity-50">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedMonth}
                  onValueChange={handleMonthChange}
                  disabled={isValidating || !selectedYear}
                >
                  <SelectTrigger className="px-3 py-2 bg-background border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 disabled:opacity-50">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedDay}
                  onValueChange={handleDayChange}
                  disabled={isValidating || !selectedMonth}
                >
                  <SelectTrigger className="px-3 py-2 bg-background border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 disabled:opacity-50">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {days.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={
                  isValidating ||
                  (!name.trim() && !dateOfBirth) ||
                  !selectedYear ||
                  !selectedMonth ||
                  !selectedDay
                }
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70  disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              >
                {isValidating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                    Searching...
                  </span>
                ) : (
                  "Search AML Database"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
