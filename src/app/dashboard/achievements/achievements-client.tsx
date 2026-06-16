"use client"

import { useState, useTransition } from "react"
import { createAchievement, updateAchievement, deleteAchievement } from "@/lib/actions/achievements"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Achievement } from "@/types/supabase"
import { Pencil, Plus, Trash2 } from "lucide-react"

const CATEGORY_LABELS: Record<string, string> = {
  speaker_award: "Speaker Award",
  adjudication_award: "Adjudication Award",
  team_result: "Team Result",
  training_conducted: "Training Conducted",
  other: "Other",
}

export function AchievementsClient({ achievements }: { achievements: Achievement[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = editing
        ? await updateAchievement(editing.id, formData)
        : await createAchievement(formData)
      if (result?.error) toast.error(result.error)
      else {
        toast.success(editing ? "Achievement updated" : "Achievement added")
        setOpen(false)
        setEditing(null)
      }
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this achievement?")) return
    startTransition(async () => {
      const result = await deleteAchievement(id)
      if (result?.error) toast.error(result.error)
      else toast.success("Achievement deleted")
    })
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null) }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="size-4 mr-2" />Add achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit achievement" : "Add achievement"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update the details below." : "Admin will verify before it appears publicly."}
              </DialogDescription>
            </DialogHeader>
            <form key={editing?.id ?? "new"} action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={editing?.title ?? ""} required placeholder="e.g. Best Speaker" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={editing?.category ?? "speaker_award"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tournament_name">Tournament</Label>
                  <Input id="tournament_name" name="tournament_name" defaultValue={editing?.tournament_name ?? ""} placeholder="XYZ Open" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tournament_year">Year</Label>
                  <Input id="tournament_year" name="tournament_year" type="number" defaultValue={editing?.tournament_year ?? ""} placeholder="2024" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position / Result</Label>
                  <Input id="position" name="position" defaultValue={editing?.position ?? ""} placeholder="1st Place, QF..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievement_date">Date</Label>
                  <Input id="achievement_date" name="achievement_date" type="date" defaultValue={editing?.achievement_date ?? ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" name="description" defaultValue={editing?.description ?? ""} rows={3} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditing(null) }}>Cancel</Button>
                <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : (editing ? "Update" : "Add")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {achievements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No achievements yet. Click &quot;Add achievement&quot; to add your first one.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {achievements.map((a) => (
            <Card key={a.id}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{a.title}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="secondary">{CATEGORY_LABELS[a.category]}</Badge>
                    {a.tournament_name && <span>{a.tournament_name}</span>}
                    {a.tournament_year && <span>· {a.tournament_year}</span>}
                    {a.position && <span>· {a.position}</span>}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {a.is_verified
                    ? <Badge>Verified</Badge>
                    : <Badge variant="outline">Pending</Badge>}
                  {!a.is_verified && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => { setEditing(a); setOpen(true) }}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(a.id)} disabled={isPending}>
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardHeader>
              {a.description && (
                <CardContent className="pt-0 text-sm text-muted-foreground">{a.description}</CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
