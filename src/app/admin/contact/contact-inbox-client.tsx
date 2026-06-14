"use client"

import { useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Mail, MailOpen, Trash2, Circle } from "lucide-react"

type Message = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

function getSubject(subject: string | null) {
  const value = subject?.trim()
  return value && value.length > 0 ? value : "No subject"
}

export default function ContactInboxClient({ messages: initial }: { messages: Message[] }) {
  const [messages, setMessages] = useState(initial)
  const [selected, setSelected] = useState<Message | null>(null)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const supabase = createClient()

  const displayed = useMemo(
    () => (filter === "unread" ? messages.filter((m) => !m.is_read) : messages),
    [filter, messages]
  )

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.is_read).length,
    [messages]
  )

  async function markRead(id: string, is_read: boolean) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update")
      return
    }

    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read } : m)))
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, is_read } : null))
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return

    const { error } = await supabase.from("contact_messages").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete")
      return
    }

    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
    toast.success("Message deleted")
  }

  async function openMessage(msg: Message) {
    setSelected(msg)
    if (!msg.is_read) await markRead(msg.id, true)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-5 shadow-[0_14px_38px_rgba(15,30,61,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C19A3D]">
                Inbox filters
              </p>
              <p className="mt-2 text-sm text-[#0F1E3D]/60">
                Review all incoming messages or focus on unread ones.
              </p>
            </div>

            {unreadCount > 0 && (
              <span className="rounded-full bg-[#C19A3D] px-3 py-1 text-xs font-semibold text-white">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="mt-5 flex gap-2">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${filter === f
                    ? "bg-[#0F1E3D] text-white"
                    : "border border-[#0F1E3D]/15 bg-white text-[#0F1E3D] hover:border-[#C19A3D]/45"
                  }`}
              >
                {f === "all" ? `All (${messages.length})` : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {displayed.length === 0 ? (
            <div className="rounded-[24px] border border-[#0F1E3D]/10 bg-white p-10 text-center shadow-[0_14px_38px_rgba(15,30,61,0.06)]">
              <Mail size={32} className="mx-auto mb-3 text-[#0F1E3D]/25" />
              <p className="font-medium text-[#0F1E3D]/55">No messages found</p>
            </div>
          ) : (
            displayed.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full rounded-[22px] border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,30,61,0.08)] ${selected?.id === msg.id
                    ? "border-[#C19A3D] bg-[#FFF8E8]"
                    : msg.is_read
                      ? "border-[#0F1E3D]/10 bg-white"
                      : "border-[#0F1E3D]/18 bg-white"
                  }`}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    {!msg.is_read && (
                      <Circle
                        size={7}
                        className="mt-1 shrink-0 fill-[#C19A3D] text-[#C19A3D]"
                      />
                    )}
                    <span
                      className={`truncate text-sm text-[#0F1E3D] ${msg.is_read ? "font-medium" : "font-semibold"
                        }`}
                    >
                      {msg.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-xs text-[#0F1E3D]/40">
                    {formatShortDate(msg.created_at)}
                  </span>
                </div>

                <p className="truncate text-sm font-medium text-[#0F1E3D]/82">
                  {getSubject(msg.subject)}
                </p>
                <p className="mt-0.5 truncate text-xs text-[#0F1E3D]/50">
                  {msg.message}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      <div>
        {!selected ? (
          <div className="flex h-72 flex-col items-center justify-center rounded-[24px] border border-[#0F1E3D]/10 bg-white p-12 text-center shadow-[0_14px_38px_rgba(15,30,61,0.06)]">
            <MailOpen size={36} className="mb-3 text-[#0F1E3D]/20" />
            <p className="font-medium text-[#0F1E3D]/50">Select a message to read</p>
          </div>
        ) : (
          <div className="rounded-[24px] border border-[#0F1E3D]/10 bg-white p-6 shadow-[0_14px_38px_rgba(15,30,61,0.06)] sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="mb-1 text-lg font-bold text-[#0F1E3D]">
                  {getSubject(selected.subject)}
                </h2>
                <p className="text-sm text-[#0F1E3D]/60">
                  From{" "}
                  <span className="font-medium text-[#0F1E3D]">{selected.name}</span>
                  {" · "}
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-[#C19A3D] hover:underline"
                  >
                    {selected.email}
                  </a>
                  {" · "}
                  {formatLongDate(selected.created_at)}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => markRead(selected.id, !selected.is_read)}
                  title={selected.is_read ? "Mark unread" : "Mark read"}
                  className="rounded-lg border border-[#0F1E3D]/20 p-2 text-[#0F1E3D]/60 transition-colors hover:border-[#C19A3D]/50 hover:text-[#0F1E3D]"
                >
                  {selected.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
                </button>

                <button
                  onClick={() => deleteMessage(selected.id)}
                  title="Delete"
                  className="rounded-lg border border-[#0F1E3D]/20 p-2 text-[#0F1E3D]/60 transition-colors hover:border-red-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="border-t border-[#0F1E3D]/10 pt-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#0F1E3D]/80">
                {selected.message}
              </p>
            </div>

            <div className="mt-6 border-t border-[#0F1E3D]/10 pt-4">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(getSubject(selected.subject))}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0F1E3D] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a2e5a]"
              >
                <Mail size={14} />
                Reply via Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}