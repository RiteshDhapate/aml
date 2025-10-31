"use client"

import type React from "react"
import type { AMLResponse } from "@/lib/api"

interface PersonProfileProps {
  data: AMLResponse
  onReset?: () => void
}

export default function PersonProfile({ data, onReset }: PersonProfileProps) {
  const result = data.response.results[0]
  console.log(result)
  const props = result.properties

  // Helper function to get first value from array or return default
  const getFirst = (arr: string[] | undefined, defaultValue = "N/A"): string => {
    return arr && arr.length > 0 ? arr[0] : defaultValue
  }

  // Helper function to format match type
  const getMatchType = (score: number): string => {
    if (score === 1.0) return "Perfect Match"
    if (score >= 0.8) return "High Match"
    if (score >= 0.6) return "Medium Match"
    return "Low Match"
  }

  // Helper function to format date
  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  // Extract and format notes for different categories
  const formatNotes = () => {
    if (!props.notes) return []

    return props.notes.map((note, index) => {
      // Try to extract title from note content
      let title = "Official Note"
      const content = note

      if (note.includes("EU") || note.includes("European")) {
        title = "EU Sanctions"
      } else if (note.includes("Ukraine")) {
        title = "Ukraine Sanctions"
      } else if (note.includes("corruption") || note.includes("Corruption")) {
        title = "Corruption Allegations"
      } else if (note.includes("Date of listing")) {
        title = "Listing Information"
      } else if (note.includes("Disqualified")) {
        title = "Disqualification"
      }

      return { title, content }
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-5">
      {/* Search Summary Header */}
      <header className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-700 mb-2.5">AML Search Results</h1>
            <div className="flex gap-5 flex-wrap">
              <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
                Total Results: {data.response.total.value}
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">Status: {data.response.status}</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
                Query: {data.response.query.properties.name.join(", ")}
              </span>
            </div>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              New Search
            </button>
          )}
        </div>
      </header>

      {/* Main Profile */}
      <main className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-600 text-white p-8">
          <h2 className="text-4xl font-bold mb-4">{result.caption}</h2>
          <div className="flex gap-4 items-center flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                result.score === 1.0 ? "bg-green-600" : result.score >= 0.8 ? "bg-yellow-600" : "bg-red-600"
              }`}
            >
              {getMatchType(result.score)}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded text-sm">Score: {result.score}</span>
            <span className="bg-white/20 px-3 py-1 rounded text-sm">ID: {result.id}</span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          {/* Basic Information */}
          <section className="mb-8 pb-5 border-b border-gray-100">
            <h3 className="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-blue-500 inline-block">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem label="Birth Date" value={getFirst(props.birthDate)} />
              <InfoItem label="Birth Place" value={getFirst(props.birthPlace)} />
              <InfoItem label="Gender" value={getFirst(props.gender)} />
              <InfoItem label="Nationality" value={getFirst(props.nationality)} />
              <InfoItem label="Religion" value={props.religion?.join(", ") || "N/A"} />
            </div>
          </section>

          {/* Current Positions */}
          {props.position && props.position.length > 0 && (
            <section className="mb-8 pb-5 border-b border-gray-100">
              <h3 className="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-blue-500 inline-block">
                Current Positions
              </h3>
              <ul className="space-y-2">
                {props.position.map((position, index) => (
                  <li key={index} className="pl-5 relative py-2 border-b border-gray-100 last:border-b-0">
                    <span className="absolute left-0 text-blue-500 font-bold">•</span>
                    {position}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Education */}
          {props.education && props.education.length > 0 && (
            <section className="mb-8 pb-5 border-b border-gray-100">
              <h3 className="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-blue-500 inline-block">
                Education
              </h3>
              <ul className="space-y-2">
                {props.education.map((edu, index) => (
                  <li key={index} className="pl-5 relative py-2 border-b border-gray-100 last:border-b-0">
                    <span className="absolute left-0 text-blue-500 font-bold">•</span>
                    {edu}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Sanctions */}
          <section className="mb-8 pb-5 border-b border-gray-100">
            <h3 className="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-blue-500 inline-block">
              Sanctions & Legal Status
            </h3>
            <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
              <div className="bg-red-500 text-white p-4 rounded-md mb-5 text-center">
                <strong>⚠️ Subject to Multiple International Sanctions</strong>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Listed in {result.datasets.length} Datasets:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.datasets.map((dataset, index) => (
                    <span key={index} className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                      {dataset.replace(/_/g, " ").toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Official Notes */}
          {props.notes && props.notes.length > 0 && (
            <section className="mb-8 pb-5 border-b border-gray-100">
              <h3 className="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-blue-500 inline-block">
                Official Notes
              </h3>
              <div className="space-y-4">
                {formatNotes().map((note, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md border-l-4 border-orange-400">
                    <p className="leading-relaxed">
                      <strong className="text-orange-600">{note.title}:</strong> {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Known Aliases */}
          {(props.alias || props.name) && (
            <section className="mb-8 pb-5 border-b border-gray-100">
              <h3 className="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-blue-500 inline-block">
                Known Names & Aliases
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {/* Show all names first */}
                {props.name?.map((name, index) => (
                  <span key={`name-${index}`} className="bg-blue-100 px-3 py-2 rounded text-sm font-medium">
                    {name}
                  </span>
                ))}
                {/* Then show aliases */}
                {props.alias?.map((alias, index) => (
                  <span key={`alias-${index}`} className="bg-gray-100 px-3 py-2 rounded text-sm">
                    {alias}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Known Addresses */}
          {props.address && props.address.length > 0 && (
            <section className="mb-8 pb-5 border-b border-gray-100">
              <h3 className="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-blue-500 inline-block">
                Known Addresses
              </h3>
              <ul className="space-y-2">
                {props.address.map((address, index) => (
                  <li key={index} className="pl-5 relative py-2 border-b border-gray-100 last:border-b-0">
                    <span className="absolute left-0 text-blue-500 font-bold">•</span>
                    {address}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Record Information */}
          <section>
            <h3 className="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-blue-500 inline-block">
              Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem label="First Seen" value={formatDate(result.first_seen)} />
              <InfoItem label="Last Seen" value={formatDate(result.last_seen)} />
              <InfoItem label="Last Modified" value={getFirst(props.modifiedAt)} />
              {/* <InfoItem
                label="Website"
                value={
                  props.website && props.website[0] ? (
                    <a
                      href={props.website[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {props.website[0].replace("http://", "").replace("https://", "")}
                    </a>
                  ) : (
                    "N/A"
                  )
                }
              /> */}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

interface InfoItemProps {
  label: string
  value: string | React.ReactNode
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold text-gray-500 text-xs uppercase tracking-wide">{label}:</label>
      <span className="text-slate-700">{value}</span>
    </div>
  )
}
