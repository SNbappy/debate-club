"use client"

import { useMemo, useState, useTransition } from "react"
import {
  adminSetMemberVerified,
  adminSetMemberRole,
  adminSetMemberAdmin,
} from "@/lib/actions/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Profile } from "@/types/supabase"
import {
  Check,
  Mail,
  Pencil,
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  X,
} from "lucide-react"

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

  const pendingProfiles = useMemo(
    () => profiles.filter((p) => !p.is_verified),
    [profiles]
  )

  const verifiedProfiles = useMemo(
    () => profiles.filter((p) => p.is_verified),
    [profiles]
  )

  function act(fn: () => Promise<{ error?: string }>, msg: string) {
    startTransition(async () => {
      const result = await fn()
      if (result?.error) toast.error(result.error)
      else toast.success(msg)
    })
  }

  function handleRoleSubmit(formData: FormData) {
    if (!editing) return

    const role = formData.get("role") as string
    const execPosition = (formData.get("exec_position") as string) ?? ""

    act(() => adminSetMemberRole(editing.id, role, execPosition), "Role updated")
    setEditing(null)
  }

  function MemberCard({ p, urgent = false }: { p: Profile; urgent?: boolean }) {
    return (
      <div
        className={`rounded-[22px] border p-5 transition-shadow hover:shadow-[0_14px_35px_rgba(15,30,61,0.08)] ${
          urgent
            ? "border-amber-200 bg-amber-50/60"
            : "border-[#0F1E3D]/8 bg-white"
        }`}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[1rem] font-semibold text-[#0F1E3D]">
                {p.full_name || "Unnamed"}
              </h3>

              {p.is_verified ? (
                <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="rounded-full border-amber-300 bg-amber-50 text-amber-700"
                >
                  Pending
                </Badge>
              )}

              {p.is_admin && (
                <Badge className="rounded-full bg-[#0F1E3D] text-white hover:bg-[#0F1E3D]">
                  Admin
                </Badge>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#0F1E3D]/58">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {p.email}
              </span>
              {p.batch_year && <span>· Batch {p.batch_year}</span>}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-[#0F1E3D]/12 bg-[#F8F8FA] text-[#0F1E3D]"
              >
                {ROLE_LABELS[p.role] ?? p.role}
              </Badge>

              {p.exec_position && (
                <span className="text-sm text-[#0F1E3D]/55">{p.exec_position}</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing(p)}
              className="rounded-xl border-[#0F1E3D]/12"
            >
              <Pencil className="mr-1.5 size-4" />
              Role
            </Button>

            {p.is_verified ? (
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  act(() => adminSetMemberVerified(p.id, false), "Member unverified")
                }
                className="rounded-xl border-[#0F1E3D]/12"
              >
                <X className="mr-1.5 size-4" />
                Unverify
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={isPending}
                onClick={() =>
                  act(() => adminSetMemberVerified(p.id, true), "Member verified")
                }
                className="rounded-xl bg-[#0F1E3D] text-white hover:bg-[#1a2e5a]"
              >
                <Check className="mr-1.5 size-4" />
                Verify
              </Button>
            )}

            {p.is_admin ? (
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  act(() => adminSetMemberAdmin(p.id, false), "Admin removed")
                }
                className="rounded-xl border-[#0F1E3D]/12"
              >
                <ShieldOff className="mr-1.5 size-4" />
                Remove admin
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  act(() => adminSetMemberAdmin(p.id, true), "Admin granted")
                }
                className="rounded-xl border-[#0F1E3D]/12"
              >
                <Shield className="mr-1.5 size-4" />
                Make admin
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="rounded-[22px] border border-dashed border-[#0F1E3D]/15 bg-white p-10 text-center">
        <UserX className="mx-auto mb-4 size-10 text-[#0F1E3D]/20" />
        <p className="text-sm font-medium text-[#0F1E3D]/50">No member records found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {pendingProfiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck className="size-4 text-[#C19A3D]" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
                Pending approvals
              </h3>
            </div>

            <div className="space-y-3">
              {pendingProfiles.map((p) => (
                <MemberCard key={p.id} p={p} urgent />
              ))}
            </div>
          </div>
        )}

        {verifiedProfiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-[#C19A3D]" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0F1E3D]/55">
                Verified members
              </h3>
            </div>

            <div className="space-y-3">
              {verifiedProfiles.map((p) => (
                <MemberCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Set role for {editing?.full_name}</DialogTitle>
            <DialogDescription>
              Role determines how the member appears publicly.
            </DialogDescription>
          </DialogHeader>

          <form key={editing?.id} action={handleRoleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue={editing?.role ?? "member"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exec_position">Executive position (optional)</Label>
              <Input
                id="exec_position"
                name="exec_position"
                defaultValue={editing?.exec_position ?? ""}
                placeholder="e.g. Treasurer, Joint Secretary"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
