"use client"

import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ReactNode, useRef } from "react"
import { X, Download, GripVertical } from "lucide-react"
import { motion } from "motion/react"

export function FilePreviewModal({ url, children }: { url: string; children: ReactNode }) {
  const isImage = /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(url)
  const constraintsRef = useRef<HTMLDivElement>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        showCloseButton={false} 
        className="max-w-[100vw] sm:max-w-[100vw] w-screen h-[100dvh] m-0 p-0 border-none bg-black/40 backdrop-blur-md rounded-none shadow-none duration-200"
      >
        <DialogTitle className="sr-only">File Preview</DialogTitle>
        
        {/* Draggable Constraints Area */}
        <div ref={constraintsRef} className="absolute inset-4 sm:inset-6 z-[60] pointer-events-none">
          {/* Movable Controls Island */}
          <motion.div 
            drag 
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            className="absolute top-0 right-0 sm:right-4 flex flex-col items-center gap-3 pointer-events-auto"
          >
            <div className="p-2 cursor-grab active:cursor-grabbing bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white/50 hover:text-white/80 transition-colors shadow-lg border border-white/5">
              <GripVertical className="size-4" />
            </div>

            {isImage && (
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center text-white bg-black/60 hover:bg-black/80 backdrop-blur-md transition-colors p-3 rounded-full shadow-lg border border-white/10" 
                aria-label="Download"
              >
                <Download className="size-5 sm:size-6" />
              </a>
            )}
            
            <DialogClose className="inline-flex items-center justify-center text-white bg-red-500/80 hover:bg-red-600 backdrop-blur-md transition-colors p-3 rounded-full shadow-lg border border-white/10" aria-label="Close">
              <X className="size-5 sm:size-6" />
            </DialogClose>
          </motion.div>
        </div>

        {/* Content area */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden p-0">
          {isImage ? (
            <div className="p-4 sm:p-12 w-full h-full flex items-center justify-center">
              <img 
                src={url} 
                alt="Preview" 
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
              />
            </div>
          ) : (
            <iframe 
              src={`${url}#view=FitH`} 
              className="w-full h-full bg-white" 
              title="File Preview"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
