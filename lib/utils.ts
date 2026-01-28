import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates HMAC SHA-256 signature for API authentication
 * @param message - The message to sign (format: `${timestamp}:${body}`)
 * @param secretKey - The secret key for HMAC
 * @returns Base64-encoded signature
 */
export async function generateHMACSignature(
  message: string,
  secretKey: string
): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secretKey)

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message))
  const bytes = new Uint8Array(signature)
  let binary = ""
  for (let b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

/**
 * Generates authentication headers (X-Signature and X-Timestamp)
 * @param method - HTTP method (GET or POST)
 * @param body - Request body (JSON string for POST, empty string for GET)
 * @param secretKey - The secret key for HMAC
 * @returns Object with X-Signature and X-Timestamp headers
 */
export async function generateAuthHeaders(
  method: "GET" | "POST",
  body: string = "",
  secretKey: string
): Promise<{ "X-Signature": string; "X-Timestamp": string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const message = `${timestamp}:${body}`
  const signature = await generateHMACSignature(message, secretKey)

  return {
    "X-Signature": signature,
    "X-Timestamp": timestamp,
  }
}