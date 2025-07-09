"use client"

import type React from "react"

import { useState } from "react"

interface TokenFormProps {
  onSubmit: (token: string) => void
}

export default function TokenForm({ onSubmit }: TokenFormProps) {
  const [token, setToken] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token.trim()) {
      alert("Please enter a CRM token")
      return
    }

    // Basic JWT token validation (should start with eyJ)
    if (!token.startsWith("eyJ")) {
      alert("Invalid token format. CRM token should be a valid JWT token.")
      return
    }

    setIsValidating(true)
    await onSubmit(token.trim())
    setIsValidating(false)
  }

  const handlePasteExample = () => {
    setToken(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZWFkX2lkIjoiNjg2YTU2Mzk0YzdiNTEwYzcifQ.Gf17tvMtPqCJce-Hfn9O6-QNUNph35QFCo7Rc-qf7WQ",
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">AML Search Portal</h1>
            <p className="text-gray-600">Enter your CRM token to search AML databases</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                CRM Token
              </label>
              <textarea
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your JWT CRM token here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
                disabled={isValidating}
              />
              <p className="mt-1 text-xs text-gray-500">Token should start with "eyJ" and be a valid JWT format</p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isValidating || !token.trim()}
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

              <button
                type="button"
                onClick={handlePasteExample}
                disabled={isValidating}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                Use Example
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">How it works:</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Enter your valid CRM JWT token</li>
              <li>• The system will search international AML databases</li>
              <li>• Results include sanctions, watchlists, and PEP data</li>
              <li>• Data is sourced from 25+ international databases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
