import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from "react-markdown"

const TYPE_LABELS: Record<string, string> = {
  news: "News", blog: "Blog", tournament_writeup: "Tournament Writeup", announcement: "Announcement",
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles!author_id(full_name, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()

  if (!post) notFound()
  const author = (post as any).profiles

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/posts" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="size-4 mr-1" /> All posts
      </Link>

      <Badge variant="secondary" className="mb-4">{TYPE_LABELS[post.type]}</Badge>
      <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
      <div className="text-sm text-muted-foreground mb-8">
        {author?.full_name && (
          author.slug
            ? <>By <Link href={`/members/${author.slug}`} className="hover:underline">{author.full_name}</Link></>
            : <>By {author.full_name}</>
        )}{author?.full_name && post.published_at && " · "}
        {post.published_at && new Date(post.published_at).toLocaleDateString()}
      </div>

      {post.cover_image_url && (
        <img src={post.cover_image_url} alt={post.title} className="w-full aspect-video object-cover rounded-lg mb-8" />
      )}

      <div className="space-y-3 text-base leading-relaxed">
        <ReactMarkdown components={{
          h1: (props) => <h1 className="text-3xl font-bold mt-6 mb-3" {...props} />,
          h2: (props) => <h2 className="text-2xl font-bold mt-5 mb-2" {...props} />,
          h3: (props) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
          p: (props) => <p className="mb-3 leading-relaxed" {...props} />,
          ul: (props) => <ul className="list-disc ml-6 mb-3 space-y-1" {...props} />,
          ol: (props) => <ol className="list-decimal ml-6 mb-3 space-y-1" {...props} />,
          a: (props) => <a className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />,
          blockquote: (props) => <blockquote className="border-l-4 pl-4 italic my-4 text-muted-foreground" {...props} />,
          img: ({src, alt}) => <img src={src as string} alt={alt} className="max-w-full rounded my-4" />,
        }}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from("posts").select("title, excerpt").eq("slug", slug).eq("is_published", true).maybeSingle()
  if (!post) return { title: "Post not found" }
  return { title: post.title, description: post.excerpt ?? undefined }
}
