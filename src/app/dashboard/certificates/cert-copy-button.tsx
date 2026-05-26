"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"

export function CertCopyButton({ certificateId }: { certificateId: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(`${window.location.origin}/verify/${certificateId}`)
    setCopied(true)
    toast.success("Verify link copied")
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Button size="sm" variant="outline" onClick={copy}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  )
}
