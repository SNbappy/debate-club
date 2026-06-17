export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_date: string | null
          category: Database["public"]["Enums"]["achievement_category"]
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_verified: boolean
          position: string | null
          profile_id: string
          title: string
          tournament_name: string | null
          tournament_year: number | null
          updated_at: string
        }
        Insert: {
          achievement_date?: string | null
          category: Database["public"]["Enums"]["achievement_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean
          position?: string | null
          profile_id: string
          title: string
          tournament_name?: string | null
          tournament_year?: number | null
          updated_at?: string
        }
        Update: {
          achievement_date?: string | null
          category?: Database["public"]["Enums"]["achievement_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean
          position?: string | null
          profile_id?: string
          title?: string
          tournament_name?: string | null
          tournament_year?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          achievement_description: string | null
          certificate_id: string
          created_at: string
          event_name: string
          file_url: string
          id: string
          issued_by: string
          issued_date: string
          profile_id: string
          recipient_name: string
          thumbnail_url: string | null
        }
        Insert: {
          achievement_description?: string | null
          certificate_id: string
          created_at?: string
          event_name: string
          file_url: string
          id?: string
          issued_by?: string
          issued_date: string
          profile_id: string
          recipient_name: string
          thumbnail_url?: string | null
        }
        Update: {
          achievement_description?: string | null
          certificate_id?: string
          created_at?: string
          event_name?: string
          file_url?: string
          id?: string
          issued_by?: string
          issued_date?: string
          profile_id?: string
          recipient_name?: string
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          end_date: string | null
          event_date: string
          id: string
          is_published: boolean
          location: string | null
          registration_url: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          is_published?: boolean
          location?: string | null
          registration_url?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          is_published?: boolean
          location?: string | null
          registration_url?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          is_published: boolean
          slug: string
          title: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          is_published?: boolean
          slug: string
          title: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          is_published?: boolean
          slug?: string
          title?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          album_id: string
          caption: string | null
          created_at: string
          id: string
          image_url: string
          order_index: number
        }
        Insert: {
          album_id: string
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          order_index?: number
        }
        Update: {
          album_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      post_mentions: {
        Row: {
          post_id: string
          profile_id: string
        }
        Insert: {
          post_id: string
          profile_id: string
        }
        Update: {
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_mentions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_mentions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          type: Database["public"]["Enums"]["post_type"]
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          alumni_year: number | null
          avatar_url: string | null
          batch_year: number | null
          bio: string | null
          cover_image_url: string | null
          created_at: string
          department: string | null
          email: string
          email_visibility: Database["public"]["Enums"]["visibility_level"]
          exec_position: string | null
          full_name: string
          id: string
          is_admin: boolean
          is_verified: boolean
          joined_year: number | null
          phone: string | null
          phone_visibility: Database["public"]["Enums"]["visibility_level"]
          role: Database["public"]["Enums"]["member_role"]
          slug: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_twitter: string | null
          social_website: string | null
          updated_at: string
        }
        Insert: {
          alumni_year?: number | null
          avatar_url?: string | null
          batch_year?: number | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          email_visibility?: Database["public"]["Enums"]["visibility_level"]
          exec_position?: string | null
          full_name?: string
          id: string
          is_admin?: boolean
          is_verified?: boolean
          joined_year?: number | null
          phone?: string | null
          phone_visibility?: Database["public"]["Enums"]["visibility_level"]
          role?: Database["public"]["Enums"]["member_role"]
          slug?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          social_website?: string | null
          updated_at?: string
        }
        Update: {
          alumni_year?: number | null
          avatar_url?: string | null
          batch_year?: number | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          email_visibility?: Database["public"]["Enums"]["visibility_level"]
          exec_position?: string | null
          full_name?: string
          id?: string
          is_admin?: boolean
          is_verified?: boolean
          joined_year?: number | null
          phone?: string | null
          phone_visibility?: Database["public"]["Enums"]["visibility_level"]
          role?: Database["public"]["Enums"]["member_role"]
          slug?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          social_website?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { uid: string }; Returns: boolean }
    }
    Enums: {
      achievement_category:
        | "speaker_award"
        | "adjudication_award"
        | "team_result"
        | "training_conducted"
        | "other"
      member_role:
        | "member"
        | "executive"
        | "general_secretary"
        | "president"
        | "alumni"
      post_type: "news" | "blog" | "tournament_writeup" | "announcement"
      visibility_level: "public" | "members_only" | "hidden"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_category: [
        "speaker_award",
        "adjudication_award",
        "team_result",
        "training_conducted",
        "other",
      ],
      member_role: [
        "member",
        "executive",
        "general_secretary",
        "president",
        "alumni",
      ],
      post_type: ["news", "blog", "tournament_writeup", "announcement"],
      visibility_level: ["public", "members_only", "hidden"],
    },
  },
} as const
