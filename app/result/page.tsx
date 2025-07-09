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

  if (!data || !data.response.results.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-6">🔍</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Records Found</h2>
        <div className="bg-yellow-200 p-5 rounded-lg">
        <div>Search Completed Successfully</div>
        <div>No AML records were found for the provided search criteria.</div>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PersonProfile data={data} onReset={handleGoHome} />
    </div>
  )
}
