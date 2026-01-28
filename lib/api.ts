import { generateAuthHeaders } from "./utils"

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

/**
 * Gets the HMAC secret key from environment variable or falls back to default
 */
function getSecretKey(): string {
  return (
    process.env.NEXT_PUBLIC_HMAC_SECRET_KEY ||
    "sdfghdvghdndvdvfsfdfsvdffsdfsdfwerweereer45353sd"
  )
}

export async function fetchAMLData(crmToken: string): Promise<AMLResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/leads/aml_result?crm_token=${encodeURIComponent(crmToken)}`;
  const secretKey = getSecretKey()

  // Generate authentication headers for GET request (empty body)
  const authHeaders = await generateAuthHeaders("GET", "", secretKey)

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Signature": authHeaders["X-Signature"],
      "X-Timestamp": authHeaders["X-Timestamp"],
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



export async function fetchSanctionsData(
  name: string,
  dateOfBirth: string
): Promise<AMLResponse> {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL_DEV}/api/leads/sanctions`;
  const params = new URLSearchParams({
    name,
    cDateOfBirth: dateOfBirth,
  });

  const url = `${baseUrl}?${params.toString()}`;
  const secretKey = getSecretKey()

  // For POST requests, body should be empty string (as per the HTML example)
  // The HTML example shows body is only used if it's JSON, but in this case
  // the parameters are in the URL, so body is empty
  const body = ""
  const authHeaders = await generateAuthHeaders("POST", body, secretKey)

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "server-token": "guestapp_9666f9e7-9c0d-4e0d-8e7a-8b9c9e7f9c0d",
      "Content-Type": "application/json",
      "X-Signature": authHeaders["X-Signature"],
      "X-Timestamp": authHeaders["X-Timestamp"],
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "Invalid or expired server token. Please check your credentials."
      );
    } else if (response.status === 404) {
      throw new Error("API endpoint not found. Please verify the URL.");
    } else if (response.status >= 500) {
      throw new Error("Internal server error. Please try again later.");
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  const responseData={
    "response": await response.json()
  }

  const data: AMLResponse = responseData;
  return data;
}
