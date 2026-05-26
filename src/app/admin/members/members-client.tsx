"use client"

import { useState, useTransition } from "react"
import { adminSetMemberVerified, adminSetMemberRole, adminSetMemberAdmin } from "@/lib/actions/admin"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Profile } from "@/types/supabase"
import { Check, X, Shield, ShieldOff, Pencil } from "lucide-react"

const ROLE_LABELS: Record<string, string> = {
  member: "Member",
  executive: "Executive",
  general_secretary: "General Secretary",
  president: "President",
  alumni: "Alumni",
}

export function MembersClient({ profiles }: { profiles: Profile[] }) {
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState<Profile | null>(null)

  function act(fn: () => Promise<{ error?: string }>, msg: string) {
    startTransition(async () => {
      const r = await fn()
      if (r?.error) toast.error(r.error)
      else toast.success(msg)
    })
  }

  function handleRoleSubmit(formData: FormData) {
    if (!editing) return
    const role = formData.get("role") as string
    const pos = (formData.get("exec_position") as string) ?? ""
    act(() => adminSetMemberRole(editing.id, role, pos), "Role updated")
    setEditing(null)
  }

  return (
    <>
      <div className="space-y-3">
        {profiles.map((p) => (
          <Card key={p.id}>
            <CardContent className="pt-6 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="font-medium">{p.full_name || "Unnamed"}</div>
                <div className="text-sm text-muted-foreground">{p.email}</div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                  <Badge variant="secondary">{ROLE_LABELS[p.role]}</Badge>
                  {p.exec_position && <span className="text-muted-foreground">{p.exec_position}</span>}
                  {p.batch_year && <span className="text-muted-foreground">· Batch {p.batch_year}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {p.is_verified ? <Badge>Verified</Badge> : <Badge variant="outline">Pending</Badge>}
                {p.is_admin && <Badge>Admin</Badge>}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                  <Pencil className="size-4 mr-1" />Role
                </Button>
                {p.is_verified ? (
                  <Button size="sm" variant="outline" disabled={isPending}
                    onClick={() => act(() => adminSetMemberVerified(p.id, false), "Unverified")}>
                    <X className="size-4 mr-1" />Unverify
                  </Button>
                ) : (
                  <Button size="sm" disabled={isPending}
                    onClick={() => act(() => adminSetMemberVerified(p.id, true), "Verified")}>
                    <Check className="size-4 mr-1" />Verify
                  </Button>
                )}
                {p.is_admin ? (
                  <Button size="sm" variant="outline" disabled={isPending}
                    onClick={() => act(() => adminSetMemberAdmin(p.id, false), "Admin removed")}>
                    <ShieldOff className="size-4 mr-1" />Remove admin
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled={isPending}
                    onClick={() => act(() => adminSetMemberAdmin(p.id, true), "Admin granted")}>
                    <Shield className="size-4 mr-1" />Make admin
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set role for {editing?.full_name}</DialogTitle>
            <DialogDescription>Role determines how the member appears publicly.</DialogDescription>
          </DialogHeader>
          <form key={editing?.id} action={handleRoleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue={editing?.role ?? "member"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exec_position">Executive position (optional)</Label>
              <Input id="exec_position" name="exec_position" defaultValue={editing?.exec_position ?? ""} placeholder="e.g. Treasurer, Joint Secretary" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
