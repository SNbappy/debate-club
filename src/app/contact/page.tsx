"use client"

import { useState, useRef } from "react"
import { motion } from "motion/react"
import { submitContactMessage } from "@/lib/actions/contact"
import { toast } from "sonner"
import { Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const fd = new FormData(e.currentTarget)
    const result = await submitContactMessage(fd)
    setPending(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Message sent! We will get back to you soon.")
      formRef.current?.reset()
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8EE]">
      {/* Hero */}
      <section className="bg-[#0F1E3D] py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] mb-3 font-semibold"
          >
            Get in Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg"
          >
            Have a question or want to join JUST Debate Club? We&apos;d love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10">
          {/* Info sidebar */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] mb-4 font-semibold">Contact Info</p>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-9 h-9 rounded-full bg-[#0F1E3D]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-[#0F1E3D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F1E3D]">Location</p>
                    <p className="text-sm text-[#0F1E3D]/70">Jashore University of Science and Technology<br />Jashore, Bangladesh</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-9 h-9 rounded-full bg-[#0F1E3D]/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-[#0F1E3D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F1E3D]">Email</p>
                    <p className="text-sm text-[#0F1E3D]/70">justdebateclub@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-9 h-9 rounded-full bg-[#0F1E3D]/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={16} className="text-[#0F1E3D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F1E3D]">Response Time</p>
                    <p className="text-sm text-[#0F1E3D]/70">We typically respond within 24–48 hours.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0F1E3D] p-6 text-white">
              <p className="font-bold text-lg mb-2">Want to join?</p>
              <p className="text-white/70 text-sm mb-4">Sign up for an account and become part of JUST Debate Club&apos;s growing community of debaters.</p>
              <a
                href="/signup"
                className="inline-block bg-[#C19A3D] hover:bg-[#a8842e] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200"
              >
                Join Now
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-[#0F1E3D]/10 p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C19A3D] mb-4 font-semibold">Send a Message</p>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-sm font-medium text-[#0F1E3D]">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#0F1E3D]/20 bg-[#FDF8EE] text-[#0F1E3D] placeholder:text-[#0F1E3D]/40 focus:outline-none focus:ring-2 focus:ring-[#C19A3D]/40 focus:border-[#C19A3D] transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-[#0F1E3D]">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#0F1E3D]/20 bg-[#FDF8EE] text-[#0F1E3D] placeholder:text-[#0F1E3D]/40 focus:outline-none focus:ring-2 focus:ring-[#C19A3D]/40 focus:border-[#C19A3D] transition-colors text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-sm font-medium text-[#0F1E3D]">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="What is this about?"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#0F1E3D]/20 bg-[#FDF8EE] text-[#0F1E3D] placeholder:text-[#0F1E3D]/40 focus:outline-none focus:ring-2 focus:ring-[#C19A3D]/40 focus:border-[#C19A3D] transition-colors text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-[#0F1E3D]">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-2.5 rounded-lg border border-[#0F1E3D]/20 bg-[#FDF8EE] text-[#0F1E3D] placeholder:text-[#0F1E3D]/40 focus:outline-none focus:ring-2 focus:ring-[#C19A3D]/40 focus:border-[#C19A3D] transition-colors text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-[#0F1E3D] hover:bg-[#1a2e5a] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors duration-200 text-sm"
                >
                  {pending ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
