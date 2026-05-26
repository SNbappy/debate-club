import type { Database } from "./database"

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]

export type Profile = Tables<"profiles">
export type Achievement = Tables<"achievements">
export type Certificate = Tables<"certificates">
export type Post = Tables<"posts">
export type Event = Tables<"events">
export type GalleryAlbum = Tables<"gallery_albums">
export type GalleryImage = Tables<"gallery_images">
export type ContactMessage = Tables<"contact_messages">
