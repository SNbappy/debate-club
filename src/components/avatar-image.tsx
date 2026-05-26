"use client"

import { useState } from "react"

interface AvatarImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  fallbackClassName?: string
  fallback?: string
}

export function AvatarImage({ src, alt, className, fallback }: AvatarImageProps) {
  const [error, setError] = useState(false)

  const initials = fallback
    ? fallback
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  if (!src || error) {
    return (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#C19A3D",
          color: "#0F1E3D",
          fontWeight: 700,
          fontSize: "0.75em",
          userSelect: "none",
        }}
        aria-label={alt}
      >
        {initials}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}
