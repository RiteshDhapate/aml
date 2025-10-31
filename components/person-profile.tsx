"use client";

import type React from "react";
import type { AMLResponse } from "@/lib/api";

interface PersonProfileProps {
  data: AMLResponse;
  onReset?: () => void;
}

export default function PersonProfile({ data, onReset }: PersonProfileProps) {
  const result = data.response.results[0];
  console.log(result);
  const props = result.properties;

  // Helper function to get first value from array or return default
  const getFirst = (
    arr: string[] | undefined,
    defaultValue = "N/A"
  ): string => {
    return arr && arr.length > 0 ? arr[0] : defaultValue;
  };

  // Helper function to format match type
  const getMatchType = (score: number): string => {
    if (score === 1.0) return "Perfect Match";
    if (score >= 0.8) return "High Match";
    if (score >= 0.6) return "Medium Match";
    return "Low Match";
  };

  // Helper function to format date
  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Extract and format notes for different categories
  const formatNotes = () => {
    if (!props.notes) return [];

    return props.notes.map((note, index) => {
      // Try to extract title from note content
      let title = "Official Note";
      const content = note;

      if (note.includes("EU") || note.includes("European")) {
        title = "EU Sanctions";
      } else if (note.includes("Ukraine")) {
        title = "Ukraine Sanctions";
      } else if (note.includes("corruption") || note.includes("Corruption")) {
        title = "Corruption Allegations";
      } else if (note.includes("Date of listing")) {
        title = "Listing Information";
      } else if (note.includes("Disqualified")) {
        title = "Disqualification";
      }

      return { title, content };
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      {/* Search Summary Header */}
      <header className="bg-card p-6 rounded-xl shadow-lg border border-border/50 mb-6 backdrop-blur-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AML Search Results
            </h1>
            <div className="flex gap-4 flex-wrap">
              <span className="px-4 py-2 bg-muted rounded-lg text-sm font-medium text-muted-foreground border">
                Total Results: {data.response.total.value}
              </span>
              <span className="px-4 py-2 bg-muted rounded-lg text-sm font-medium text-muted-foreground border">
                Status: {data.response.status}
              </span>
              <span className="px-4 py-2 bg-muted rounded-lg text-sm font-medium text-muted-foreground border">
                Query: {data.response.query.properties.name.join(", ")}
              </span>
            </div>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-5 py-2 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg"
            >
              New Search
            </button>
          )}
        </div>
      </header>

      {/* Main Profile */}
      <main className="bg-card rounded-xl shadow-lg border border-border/50 overflow-hidden backdrop-blur-sm">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground p-8">
          <h2 className="text-4xl font-bold mb-4">{result.caption}</h2>
          <div className="flex gap-4 items-center flex-wrap">
            <span
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase shadow-md ${
                result.score === 1.0
                  ? "bg-green-500"
                  : result.score >= 0.8
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {getMatchType(result.score)}
            </span>
            <span className="bg-primary-foreground/20 px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
              Score: {result.score}
            </span>
            <span className="bg-primary-foreground/20 px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
              ID: {result.id}
            </span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8 bg-card-foreground/5">
          {/* Basic Information */}
          <section className="mb-8 pb-5 border-b border-border">
            <h3 className="text-card-foreground text-xl font-semibold mb-4 pb-1 border-b-2 border-primary inline-block">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem label="Birth Date" value={getFirst(props.birthDate)} />
              <InfoItem
                label="Birth Place"
                value={getFirst(props.birthPlace)}
              />
              <InfoItem label="Gender" value={getFirst(props.gender)} />
              <InfoItem
                label="Nationality"
                value={getFirst(props.nationality)}
              />
              <InfoItem
                label="Religion"
                value={props.religion?.join(", ") || "N/A"}
              />
            </div>
          </section>

          {/* Current Positions */}
          {props.position && props.position.length > 0 && (
            <section className="mb-8 pb-5 border-b border-border">
              <h3 className="text-card-foreground text-xl font-semibold mb-4 pb-1 border-b-2 border-primary inline-block">
                Current Positions
              </h3>
              <ul className="space-y-2">
                {props.position.map((position, index) => (
                  <li
                    key={index}
                    className="pl-5 relative py-2 border-b border-border last:border-b-0"
                  >
                    <span className="absolute left-0 text-primary font-bold">
                      •
                    </span>
                    {position}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Education */}
          {props.education && props.education.length > 0 && (
            <section className="mb-8 pb-5 border-b border-border">
              <h3 className="text-card-foreground text-xl font-semibold mb-4 pb-1 border-b-2 border-primary inline-block">
                Education
              </h3>
              <ul className="space-y-2">
                {props.education.map((edu, index) => (
                  <li
                    key={index}
                    className="pl-5 relative py-2 border-b border-border last:border-b-0"
                  >
                    <span className="absolute left-0 text-primary font-bold">
                      •
                    </span>
                    {edu}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Sanctions */}
          <section className="mb-8 pb-5 border-b border-border">
            <h3 className="text-card-foreground text-xl font-semibold mb-4 pb-1 border-b-2 border-primary inline-block">
              Sanctions & Legal Status
            </h3>
            <div className="bg-destructive/10 p-5 rounded-lg border-l-4 border-destructive">
              <div className="bg-destructive text-destructive-foreground p-4 rounded-md mb-5 text-center">
                <strong>⚠️ Subject to Multiple International Sanctions</strong>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-card-foreground">
                  Listed in {result.datasets.length} Datasets:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.datasets.map((dataset, index) => (
                    <span
                      key={index}
                      className="bg-destructive text-destructive-foreground px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      {dataset.replace(/_/g, " ").toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Official Notes */}
          {props.notes && props.notes.length > 0 && (
            <section className="mb-8 pb-5 border-b border-border">
              <h3 className="text-card-foreground text-xl font-semibold mb-4 pb-1 border-b-2 border-primary inline-block">
                Official Notes
              </h3>
              <div className="space-y-4">
                {formatNotes().map((note, index) => (
                  <div
                    key={index}
                    className="bg-muted p-4 rounded-md border-l-4 border-orange-400"
                  >
                    <p className="leading-relaxed text-card-foreground">
                      <strong className="text-orange-600">{note.title}:</strong>{" "}
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Known Aliases */}
          {(props.alias || props.name) && (
            <section className="mb-8 pb-5 border-b border-border">
              <h3 className="text-card-foreground text-xl font-semibold mb-4 pb-1 border-b-2 border-primary inline-block">
                Known Names & Aliases
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {/* Show all names first */}
                {props.name?.map((name, index) => (
                  <span
                    key={`name-${index}`}
                    className="bg-primary/10 text-primary px-3 py-2 rounded text-sm font-medium"
                  >
                    {name}
                  </span>
                ))}
                {/* Then show aliases */}
                {props.alias?.map((alias, index) => (
                  <span
                    key={`alias-${index}`}
                    className="bg-muted px-3 py-2 rounded text-sm text-muted-foreground"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Known Addresses */}
          {props.address && props.address.length > 0 && (
            <section className="mb-8 pb-5 border-b border-border">
              <h3 className="text-card-foreground text-xl font-semibold mb-4 pb-1 border-b-2 border-primary inline-block">
                Known Addresses
              </h3>
              <ul className="space-y-2">
                {props.address.map((address, index) => (
                  <li
                    key={index}
                    className="pl-5 relative py-2 border-b border-border last:border-b-0"
                  >
                    <span className="absolute left-0 text-primary font-bold">
                      •
                    </span>
                    {address}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Record Information */}
          <section>
            <h3 className="text-card-foreground text-xl font-semibold mb-4 pb-1 border-b-2 border-primary inline-block">
              Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem
                label="First Seen"
                value={formatDate(result.first_seen)}
              />
              <InfoItem
                label="Last Seen"
                value={formatDate(result.last_seen)}
              />
              <InfoItem
                label="Last Modified"
                value={getFirst(props.modifiedAt)}
              />
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
  );
}

interface InfoItemProps {
  label: string;
  value: string | React.ReactNode;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
        {label}:
      </label>
      <span className="text-card-foreground">{value}</span>
    </div>
  );
}
