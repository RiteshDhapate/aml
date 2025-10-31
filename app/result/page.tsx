"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import PersonProfile from "@/components/person-profile"
import { fetchAMLData, type AMLResponse } from "@/lib/api"

export default function ResultPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<AMLResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const crmToken = searchParams.get("crm_token")

    if (!crmToken) {
      setError("Missing CRM token in URL parameters")
      setLoading(false)
      return
    }

    setToken(crmToken)
    loadAMLData(crmToken)
  }, [searchParams])

  const loadAMLData = async (crmToken: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchAMLData(crmToken)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch AML data")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    if (token) {
      loadAMLData(token)
    }
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing AML Search</h2>
          <p className="text-gray-600 mb-4">Searching international databases...</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            {/* <p className="text-sm text-blue-700">
              <strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : "Loading..."}
            </p> */}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-6">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Failed</h2>
          
        </div>
      </div>
    )
  }

  if (!data || !data.response?.results?.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-gray-400 text-7xl mb-6 select-none">🔍</div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            No Records Found
          </h2>
          <div className="bg-yellow-200 p-6 rounded-lg mb-6 text-yellow-900">
            <p className="mb-2 font-medium">Search Completed Successfully</p>
            <p>No AML records were found for the provided search criteria.</p>
          </div>
          <ul className="text-left list-disc list-inside text-gray-700 space-y-2 mb-6">
            <li>No records found on international AML databases.</li>
            <li>No sanctions, watchlists, or PEP data available.</li>
            <li>Data is sourced from 25+ international databases.</li>
          </ul>
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-bold py-3 px-6 rounded shadow"
            type="button"
          >
            Retry Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PersonProfile data={data} onReset={handleGoHome} />
    </div>
  )
}
