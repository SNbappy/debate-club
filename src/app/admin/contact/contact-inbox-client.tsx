"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Mail, MailOpen, Trash2, Circle } from "lucide-react"
import { format } from "date-fns"

type Message = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function ContactInboxClient({ messages: initial }: { messages: Message[] }) {
  const [messages, setMessages] = useState(initial)
  const [selected, setSelected] = useState<Message | null>(null)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const supabase = createClient()

  const displayed = filter === "unread" ? messages.filter(m => !m.is_read) : messages
  const unreadCount = messages.filter(m => !m.is_read).length

  async function markRead(id: string, is_read: boolean) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read })
      .eq("id", id)
    if (error) { toast.error("Failed to update"); return }
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read } : m))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, is_read } : null)
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return
    const { error } = await supabase.from("contact_messages").delete().eq("id", id)
    if (error) { toast.error("Failed to delete"); return }
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
    toast.success("Message deleted")
  }

  async function openMessage(msg: Message) {
    setSelected(msg)
    if (!msg.is_read) await markRead(msg.id, true)
  }

  return (
    <div className="min-h-screen bg-[#FDF8EE]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] mb-1 font-semibold">Admin</p>
            <h1 className="text-3xl font-bold text-[#0F1E3D]">Contact Inbox</h1>
          </div>
          {unreadCount > 0 && (
            <span className="bg-[#C19A3D] text-white text-sm font-semibold px-3 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "unread"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-[#0F1E3D] text-white"
                  : "bg-white text-[#0F1E3D] border border-[#0F1E3D]/20 hover:border-[#C19A3D]/50"
              }`}
            >
              {f === "all" ? `All (${messages.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* List */}
          <div className="md:col-span-2 space-y-2">
            {displayed.length === 0 && (
              <div className="bg-white rounded-xl border border-[#0F1E3D]/10 p-8 text-center text-[#0F1E3D]/50">
                <Mail size={32} className="mx-auto mb-3 opacity-40" />
                <p className="font-medium">No messages</p>
              </div>
            )}
            {displayed.map(msg => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  selected?.id === msg.id
                    ? "border-[#C19A3D] bg-[#C19A3D]/5"
                    : msg.is_read
                    ? "border-[#0F1E3D]/10 bg-white"
                    : "border-[#0F1E3D]/20 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {!msg.is_read && <Circle size={7} className="fill-[#C19A3D] text-[#C19A3D] flex-shrink-0 mt-1" />}
                    <span className={`font-semibold text-sm text-[#0F1E3D] truncate ${!msg.is_read ? "" : "font-normal"}`}>
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-xs text-[#0F1E3D]/40 flex-shrink-0">
                    {format(new Date(msg.created_at), "MMM d")}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#0F1E3D]/80 truncate">{msg.subject}</p>
                <p className="text-xs text-[#0F1E3D]/50 truncate mt-0.5">{msg.message}</p>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="md:col-span-3">
            {!selected ? (
              <div className="bg-white rounded-xl border border-[#0F1E3D]/10 p-12 flex flex-col items-center justify-center text-center h-64">
                <MailOpen size={36} className="text-[#0F1E3D]/20 mb-3" />
                <p className="text-[#0F1E3D]/50 font-medium">Select a message to read</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#0F1E3D]/10 p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-[#0F1E3D] mb-1">{selected.subject}</h2>
                    <p className="text-sm text-[#0F1E3D]/60">
                      From <span className="font-medium text-[#0F1E3D]">{selected.name}</span>
                      {" · "}<a href={`mailto:${selected.email}`} className="text-[#C19A3D] hover:underline">{selected.email}</a>
                      {" · "}{format(new Date(selected.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => markRead(selected.id, !selected.is_read)}
                      title={selected.is_read ? "Mark unread" : "Mark read"}
                      className="p-2 rounded-lg border border-[#0F1E3D]/20 hover:border-[#C19A3D]/50 text-[#0F1E3D]/60 hover:text-[#0F1E3D] transition-colors"
                    >
                      {selected.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
                    </button>
                    <button
                      onClick={() => deleteMessage(selected.id)}
                      title="Delete"
                      className="p-2 rounded-lg border border-[#0F1E3D]/20 hover:border-red-400 text-[#0F1E3D]/60 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="border-t border-[#0F1E3D]/10 pt-5">
                  <p className="text-[#0F1E3D]/80 whitespace-pre-wrap text-sm leading-relaxed">{selected.message}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#0F1E3D]/10">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="inline-flex items-center gap-2 bg-[#0F1E3D] hover:bg-[#1a2e5a] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <Mail size={14} />
                    Reply via Email
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
