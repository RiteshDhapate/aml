"use client"

import { useState } from "react"
import PersonProfile from "@/components/person-profile"
import TokenForm from "@/components/token-form"
import { fetchAMLData, fetchSanctionsData, type AMLResponse } from "@/lib/api"

export default function Home() {
  const [data, setData] = useState<AMLResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleTokenSubmit = async (name: string, dateOfBirth: string) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const result = await fetchSanctionsData(name, dateOfBirth);
      setData(result);
      console.log(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null)
    setError(null)
    setHasSearched(false)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AML data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Occurred</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleReset}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (hasSearched && (!data || !data.response?.results?.length)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Records Found</h2>
          <div>
            <div>Search Completed Successfully</div>
            <div>No AML records were found for the provided search criteria.</div>
          </div>
        </div>
      </div>
    )
  }

  if (data && data.response.results.length > 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <PersonProfile data={data} onReset={handleReset} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TokenForm onSubmit={handleTokenSubmit} />
    </div>
  )
}
