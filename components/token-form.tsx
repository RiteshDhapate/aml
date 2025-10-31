"use client"

import type React from "react"

import { useState } from "react"

interface TokenFormProps {
  onSubmit: (name: string, dateOfBirth: string) => void;
}

export default function TokenForm({ onSubmit }: TokenFormProps) {
  const [name,setName]=useState("")
  const [dateOfBirth,setDateOfBirth]=useState("")
  const [isValidating, setIsValidating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

  
    setIsValidating(true)
    await onSubmit(name.trim(),dateOfBirth.toString())
    setIsValidating(false)
  }


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              AML Search Portal
            </h1>
            <p className="text-gray-600">
              Enter your CRM token to search AML databases
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={isValidating}
              />
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                // type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                placeholder="Enter name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={isValidating}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isValidating || (!name.trim() && !dateOfBirth)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {isValidating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
