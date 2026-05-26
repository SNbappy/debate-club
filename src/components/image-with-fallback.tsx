"use client"

import { useState } from "react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  fallback?: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  style?: React.CSSProperties
}

export default function ImageWithFallback({
  src,
  alt,
  fallback = "/images/placeholder.jpg",
  className,
  style,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [errored, setErrored] = useState(false)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={errored ? fallback : imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (!errored) {
          setImgSrc(fallback)
          setErrored(true)
        }
      }}
      {...props}
    />
  )
}
