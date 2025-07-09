export interface AMLResponse {
  response: {
    query: {
      id: string | null
      schema: string
      properties: {
        name: string[]
      }
    }
    total: {
      value: number
      relation: string
    }
    status: number
    results: Array<{
      id: string
      match: boolean
      score: number
      schema: string
      target: boolean
      caption: string
      datasets: string[]
      features: Record<string, number>
      last_seen: string
      first_seen: string
      properties: {
        name: string[]
        alias?: string[]
        notes?: string[]
        gender?: string[]
        topics?: string[]
        address?: string[]
        country?: string[]
        website?: string[]
        position?: string[]
        religion?: string[]
        birthDate?: string[]
        education?: string[]
        birthPlace?: string[]
        nationality?: string[]
        citizenship?: string[]
        modifiedAt?: string[]
        [key: string]: any
      }
      last_change: string
    }>
  }
}

export async function fetchAMLData(crmToken: string): Promise<AMLResponse> {
  const url = `https://guest-app-api.therufescent.com/api/leads/aml_result?crm_token=${encodeURIComponent(crmToken)}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid or expired CRM token. Please check your token and try again.")
    } else if (response.status === 404) {
      throw new Error("API endpoint not found. Please contact support.")
    } else if (response.status >= 500) {
      throw new Error("Server error occurred. Please try again later.")
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  }

  const data: AMLResponse = await response.json()
  return data
}
