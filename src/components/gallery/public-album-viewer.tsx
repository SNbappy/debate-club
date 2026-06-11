"use client"

import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

import { Reveal } from "@/components/home/animations"
import { Button } from "@/components/ui/button"

type Photo = {
  id: string
  image_url: string
  caption: string | null
  order_index: number | null
}

type PublicAlbumViewerProps = {
  albumSlug: string
  albumTitle: string
  photos: Photo[]
  initialPhotoId?: string
}

export function PublicAlbumViewer({
  albumSlug,
  albumTitle,
  photos,
  initialPhotoId,
}: PublicAlbumViewerProps) {
  const initialIndex = useMemo(() => {
    const matched = photos.findIndex((photo) => photo.id === initialPhotoId)
    return matched >= 0 ? matched : 0
  }, [photos, initialPhotoId])

  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const selectedPhoto = photos[activeIndex] ?? null
  const hasMultiple = photos.length > 1
  const previousPhoto = activeIndex > 0 ? photos[activeIndex - 1] : null
  const nextPhoto = activeIndex < photos.length - 1 ? photos[activeIndex + 1] : null

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  const openViewer = (index: number) => {
    setActiveIndex(index)
    setIsOpen(true)
  }

  const closeViewer = () => {
    setIsOpen(false)
  }

  const goToIndex = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, photos.length - 1)))
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!isOpen) return
      if (event.key === "Escape") closeViewer()
      if (event.key === "ArrowLeft" && previousPhoto) goToIndex(activeIndex - 1)
      if (event.key === "ArrowRight" && nextPhoto) goToIndex(activeIndex + 1)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [activeIndex, isOpen, nextPhoto, previousPhoto])

  if (!selectedPhoto) return null

  const viewer =
    isOpen && mounted
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={albumTitle}
            className="fixed inset-0 z-[9999] flex flex-col bg-[#081126]/97 text-white backdrop-blur-md"
          >
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                {activeIndex + 1} / {photos.length}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full border border-white/12 bg-white/8 text-white hover:bg-white/14 hover:text-white"
                onClick={closeViewer}
                aria-label="Close viewer"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-4 pb-5 sm:px-6 sm:pb-6">
              <div className="relative flex min-h-0 flex-1 items-center justify-center">
                {previousPhoto ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      goToIndex(activeIndex - 1)
                    }}
                    className="absolute left-2 top-1/2 z-[10001] inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white backdrop-blur-sm hover:bg-white/14 sm:left-4"
                    aria-label="Previous photo"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                ) : null}

                {nextPhoto ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      goToIndex(activeIndex + 1)
                    }}
                    className="absolute right-2 top-1/2 z-[10001] inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white backdrop-blur-sm hover:bg-white/14 sm:right-4"
                    aria-label="Next photo"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                ) : null}

                <div className="pointer-events-none flex h-full w-full items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 p-3 sm:p-5">
                  <img
                    src={selectedPhoto.image_url}
                    alt={albumTitle}
                    className="max-h-[76vh] max-w-full object-contain"
                  />
                </div>
              </div>

              {hasMultiple ? (
                <div className="mt-4">
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:gap-3">
                    {photos.map((photo, index) => {
                      const active = activeIndex === index
                      return (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            goToIndex(index)
                          }}
                          className={[
                            "group relative block shrink-0 rounded-[0.95rem] border p-1.5 transition-all duration-300",
                            active
                              ? "border-[#C19A3D] bg-white/10 shadow-[0_10px_28px_rgba(193,154,61,0.18)]"
                              : "border-white/10 bg-white/4 hover:border-white/30 hover:bg-white/8",
                          ].join(" ")}
                          aria-label={`View photo ${index + 1}`}
                        >
                          <div className="overflow-hidden rounded-[0.7rem] bg-[#F2EBDE]">
                            <img
                              src={photo.image_url}
                              alt={`Photo ${index + 1}`}
                              className="h-16 w-20 object-cover sm:h-20 sm:w-24"
                            />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-6 sm:pb-20 sm:pt-8 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(193,154,61,0.08),transparent_22%),radial-gradient(circle_at_86%_20%,rgba(15,30,61,0.05),transparent_20%)]" />

        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {photos.map((photo, index) => {
                const tall = index % 3 === 1
                const offset = index % 2 === 1

                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => openViewer(index)}
                    className={[
                      "group block w-full text-left",
                      offset ? "translate-y-3 sm:translate-y-5" : "",
                    ].join(" ")}
                    aria-label={`Open photo ${index + 1}`}
                  >
                    <div
                      className={[
                        "overflow-hidden rounded-[1.25rem] border bg-white p-2 transition-all duration-300",
                        "border-[#0F1E3D]/10 hover:-translate-y-1 hover:border-[#C19A3D]/35 hover:shadow-[0_16px_36px_rgba(15,30,61,0.08)]",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "overflow-hidden rounded-[0.95rem] bg-[#F2EBDE]",
                          tall ? "aspect-[3/4]" : "aspect-[4/5]",
                        ].join(" ")}
                      >
                        <img
                          src={photo.image_url}
                          alt={photo.caption ?? `Photo ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {viewer}
    </>
  )
}
