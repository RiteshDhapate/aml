"use client";

import type React from "react";

import { useState } from "react";

interface TokenFormProps {
  onSubmit: (name: string, dateOfBirth: string) => void;
}

export default function TokenForm({ onSubmit }: TokenFormProps) {
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsValidating(true);
    await onSubmit(name.trim(), dateOfBirth.toString());
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
              <input
                id="dateOfBirth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                placeholder="Enter date of birth..."
                className="w-full px-4 py-3 bg-background border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 disabled:opacity-50"
                disabled={isValidating}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isValidating || (!name.trim() && !dateOfBirth)}
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
