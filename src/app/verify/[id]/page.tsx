import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Download, ArrowLeft } from "lucide-react"

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: cert } = await supabase
    .from("certificates")
    .select("*, profiles!profile_id(full_name, slug)")
    .eq("certificate_id", id)
    .maybeSingle()

  if (!cert) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-red-300 dark:border-red-900">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mx-auto mb-4">
              <X className="size-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Not verified</h1>
            <p className="text-muted-foreground mb-1">No certificate found with ID</p>
            <p className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block mt-2">{id}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const profile = (cert as unknown as { profiles: { full_name: string; slug: string | null } | null }).profiles

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="border-green-300 dark:border-green-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <Check className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Certificate verified</CardTitle>
                <Badge variant="secondary" className="font-mono mt-1">{cert.certificate_id}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Issued to</div>
                {profile?.slug ? (
                  <Link href={`/members/${profile.slug}`} className="font-medium hover:underline">{cert.recipient_name}</Link>
                ) : (
                  <div className="font-medium">{cert.recipient_name}</div>
                )}
              </div>
              <div><div className="text-muted-foreground mb-1">Event</div><div className="font-medium">{cert.event_name}</div></div>
              <div><div className="text-muted-foreground mb-1">Issued date</div><div className="font-medium">{cert.issued_date}</div></div>
              <div><div className="text-muted-foreground mb-1">Issued by</div><div className="font-medium">{cert.issued_by}</div></div>
              {cert.achievement_description && (
                <div className="sm:col-span-2">
                  <div className="text-muted-foreground mb-1">Achievement</div>
                  <div>{cert.achievement_description}</div>
                </div>
              )}
            </div>
            <div className="pt-2">
              <a href={cert.file_url} target="_blank" rel="noopener noreferrer">
                <Button><Download className="size-4 mr-2" />View / Download</Button>
              </a>
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
            <ArrowLeft className="size-4 mr-1" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return { title: `Verify ${id}` }
}
