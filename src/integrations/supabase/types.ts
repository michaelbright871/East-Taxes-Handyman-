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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      account_lockouts: {
        Row: {
          email: string
          failed_attempts: number
          locked_until: string | null
          updated_at: string
        }
        Insert: {
          email: string
          failed_attempts?: number
          locked_until?: string | null
          updated_at?: string
        }
        Update: {
          email?: string
          failed_attempts?: number
          locked_until?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          body: string | null
          created_at: string
          href: string | null
          id: string
          is_read: boolean
          metadata: Json
          severity: string
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          href?: string | null
          id?: string
          is_read?: boolean
          metadata?: Json
          severity?: string
          title: string
          type: string
        }
        Update: {
          body?: string | null
          created_at?: string
          href?: string | null
          id?: string
          is_read?: boolean
          metadata?: Json
          severity?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      admin_security: {
        Row: {
          recovery_codes: string[]
          session_timeout_minutes: number
          two_factor_enabled: boolean
          two_factor_method: string
          two_factor_secret: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          recovery_codes?: string[]
          session_timeout_minutes?: number
          two_factor_enabled?: boolean
          two_factor_method?: string
          two_factor_secret?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          recovery_codes?: string[]
          session_timeout_minutes?: number
          two_factor_enabled?: boolean
          two_factor_method?: string
          two_factor_secret?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_presence: {
        Row: {
          agent_id: string
          avg_response_seconds: number
          created_at: string
          display_name: string | null
          is_online: boolean
          max_chats: number
          permissions: string[]
          total_chats: number
          updated_at: string
        }
        Insert: {
          agent_id: string
          avg_response_seconds?: number
          created_at?: string
          display_name?: string | null
          is_online?: boolean
          max_chats?: number
          permissions?: string[]
          total_chats?: number
          updated_at?: string
        }
        Update: {
          agent_id?: string
          avg_response_seconds?: number
          created_at?: string
          display_name?: string | null
          is_online?: boolean
          max_chats?: number
          permissions?: string[]
          total_chats?: number
          updated_at?: string
        }
        Relationships: []
      }
      ai_knowledge: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_active: boolean
          sort_order: number
          topic: string
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          topic: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          device: string | null
          event_type: string
          id: string
          metadata: Json
          path: string | null
          referrer: string | null
          region: string | null
          session_id: string | null
          source: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          event_type?: string
          id?: string
          metadata?: Json
          path?: string | null
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          source?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          event_type?: string
          id?: string
          metadata?: Json
          path?: string | null
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      before_after: {
        Row: {
          after_url: string
          before_url: string
          category: string
          created_at: string
          description: string | null
          id: string
          is_visible: boolean
          location: string | null
          project_id: string | null
          service_name: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          after_url: string
          before_url: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_visible?: boolean
          location?: string | null
          project_id?: string | null
          service_name?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          after_url?: string
          before_url?: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_visible?: boolean
          location?: string | null
          project_id?: string | null
          service_name?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "before_after_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          address: string | null
          admin_notes: string | null
          assigned_technician: string | null
          city: string | null
          created_at: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          details: string | null
          estimate_high: number | null
          estimate_low: number | null
          id: string
          photos: Json
          preferred_date: string | null
          preferred_window: string | null
          priority: string
          reference: string
          scheduled_at: string | null
          service_name: string | null
          service_slug: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          assigned_technician?: string | null
          city?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          details?: string | null
          estimate_high?: number | null
          estimate_low?: number | null
          id?: string
          photos?: Json
          preferred_date?: string | null
          preferred_window?: string | null
          priority?: string
          reference?: string
          scheduled_at?: string | null
          service_name?: string | null
          service_slug?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          assigned_technician?: string | null
          city?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          details?: string | null
          estimate_high?: number | null
          estimate_low?: number | null
          id?: string
          photos?: Json
          preferred_date?: string | null
          preferred_window?: string | null
          priority?: string
          reference?: string
          scheduled_at?: string | null
          service_name?: string | null
          service_slug?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      canned_replies: {
        Row: {
          body: string
          category: string
          created_at: string
          id: string
          shortcut: string | null
          title: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          body: string
          category?: string
          created_at?: string
          id?: string
          shortcut?: string | null
          title: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          shortcut?: string | null
          title?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      chat_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          created_at: string
          data: Json
          id: string
          is_published: boolean
          key: string
          kind: string
          label: string
          section: string
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          is_published?: boolean
          key: string
          kind?: string
          label: string
          section?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          is_published?: boolean
          key?: string
          kind?: string
          label?: string
          section?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      conversation_notes: {
        Row: {
          author_id: string | null
          author_name: string | null
          body: string
          conversation_id: string
          created_at: string
          id: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          body: string
          conversation_id: string
          created_at?: string
          id?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_notes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          agent_unread: number
          assigned_agent_id: string | null
          created_at: string
          customer_id: string
          customer_unread: number
          id: string
          last_message_at: string
          mode: string
          pinned: boolean
          queue_position: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          agent_unread?: number
          assigned_agent_id?: string | null
          created_at?: string
          customer_id: string
          customer_unread?: number
          id?: string
          last_message_at?: string
          mode?: string
          pinned?: boolean
          queue_position?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Update: {
          agent_unread?: number
          assigned_agent_id?: string | null
          created_at?: string
          customer_id?: string
          customer_unread?: number
          id?: string
          last_message_at?: string
          mode?: string
          pinned?: boolean
          queue_position?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          ends_at: string | null
          id: string
          is_active: boolean
          max_redemptions: number | null
          redemptions: number
          starts_at: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          redemptions?: number
          starts_at?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          redemptions?: number
          starts_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          created_at: string
          id: string
          level: string
          message: string
          path: string | null
          resolved: boolean
          stack: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string
          message: string
          path?: string | null
          resolved?: boolean
          stack?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          message?: string
          path?: string | null
          resolved?: boolean
          stack?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      login_activity: {
        Row: {
          created_at: string
          email: string | null
          id: string
          ip_address: string | null
          location: string | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          folder_id: string | null
          height: number | null
          id: string
          mime_type: string | null
          name: string
          size_bytes: number
          storage_path: string | null
          tags: string[]
          type: string
          updated_at: string
          uploaded_by: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          folder_id?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          name: string
          size_bytes?: number
          storage_path?: string | null
          tags?: string[]
          type?: string
          updated_at?: string
          uploaded_by?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          folder_id?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          size_bytes?: number
          storage_path?: string | null
          tags?: string[]
          type?: string
          updated_at?: string
          uploaded_by?: string | null
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "media_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      media_folders: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "media_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json
          content: string
          conversation_id: string
          created_at: string
          id: string
          reactions: Json
          read_at: string | null
          sender_id: string | null
          sender_name: string | null
          sender_role: string
        }
        Insert: {
          attachments?: Json
          content?: string
          conversation_id: string
          created_at?: string
          id?: string
          reactions?: Json
          read_at?: string | null
          sender_id?: string | null
          sender_name?: string | null
          sender_role: string
        }
        Update: {
          attachments?: Json
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          reactions?: Json
          read_at?: string | null
          sender_id?: string | null
          sender_name?: string | null
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_subscribed: boolean
          name: string | null
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_subscribed?: boolean
          name?: string | null
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_subscribed?: boolean
          name?: string | null
          source?: string
        }
        Relationships: []
      }
      popup_campaigns: {
        Row: {
          body: string | null
          conversions: number
          created_at: string
          cta_href: string | null
          cta_label: string | null
          ends_at: string | null
          headline: string
          id: string
          image_url: string | null
          impressions: number
          is_active: boolean
          name: string
          starts_at: string | null
          trigger_type: string
          trigger_value: number
          updated_at: string
        }
        Insert: {
          body?: string | null
          conversions?: number
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          ends_at?: string | null
          headline: string
          id?: string
          image_url?: string | null
          impressions?: number
          is_active?: boolean
          name: string
          starts_at?: string | null
          trigger_type?: string
          trigger_value?: number
          updated_at?: string
        }
        Update: {
          body?: string | null
          conversions?: number
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          ends_at?: string | null
          headline?: string
          id?: string
          image_url?: string | null
          impressions?: number
          is_active?: boolean
          name?: string
          starts_at?: string | null
          trigger_type?: string
          trigger_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_source: string
          email: string | null
          favorite_services: string[]
          full_name: string | null
          id: string
          last_seen_at: string | null
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_source?: string
          email?: string | null
          favorite_services?: string[]
          full_name?: string | null
          id: string
          last_seen_at?: string | null
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_source?: string
          email?: string | null
          favorite_services?: string[]
          full_name?: string | null
          id?: string
          last_seen_at?: string | null
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_media: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          kind: string
          poster_url: string | null
          project_id: string | null
          sort_order: number
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          kind?: string
          poster_url?: string | null
          project_id?: string | null
          sort_order?: number
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          kind?: string
          poster_url?: string | null
          project_id?: string | null
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          completed_on: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          is_featured: boolean
          is_visible: boolean
          location: string | null
          popularity: number
          property_type: string
          related_services: string[]
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          completed_on?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          location?: string | null
          popularity?: number
          property_type?: string
          related_services?: string[]
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          completed_on?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          location?: string | null
          popularity?: number
          property_type?: string
          related_services?: string[]
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      promo_banners: {
        Row: {
          created_at: string
          cta_href: string | null
          cta_label: string | null
          ends_at: string | null
          id: string
          is_active: boolean
          message: string
          placement: string
          starts_at: string | null
          theme: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          message: string
          placement?: string
          starts_at?: string | null
          theme?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          message?: string
          placement?: string
          starts_at?: string | null
          theme?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          admin_notes: string | null
          booking_id: string | null
          created_at: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          details: string | null
          id: string
          line_items: Json
          reference: string
          service_name: string | null
          service_slug: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          admin_notes?: string | null
          booking_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          details?: string | null
          id?: string
          line_items?: Json
          reference?: string
          service_name?: string | null
          service_slug?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          admin_notes?: string | null
          booking_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          details?: string | null
          id?: string
          line_items?: Json
          reference?: string
          service_name?: string | null
          service_slug?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          code: string
          created_at: string
          id: string
          referred_email: string | null
          referred_name: string | null
          referrer_email: string | null
          referrer_name: string
          reward: string | null
          status: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          referred_email?: string | null
          referred_name?: string | null
          referrer_email?: string | null
          referrer_name: string
          reward?: string | null
          status?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          referred_email?: string | null
          referred_name?: string | null
          referrer_email?: string | null
          referrer_name?: string
          reward?: string | null
          status?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_location: string | null
          author_name: string
          avatar_url: string | null
          body: string
          created_at: string
          customer_id: string | null
          id: string
          is_hidden: boolean
          is_pinned: boolean
          rating: number
          service_name: string | null
          sort_order: number
          source: string
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          author_location?: string | null
          author_name: string
          avatar_url?: string | null
          body: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_hidden?: boolean
          is_pinned?: boolean
          rating?: number
          service_name?: string | null
          sort_order?: number
          source?: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          author_location?: string | null
          author_name?: string
          avatar_url?: string | null
          body?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_hidden?: boolean
          is_pinned?: boolean
          rating?: number
          service_name?: string | null
          sort_order?: number
          source?: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_visible: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          is_visible: boolean
          name: string
          price_from: number | null
          price_to: number | null
          price_unit: string
          pricing_guide: Json
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          summary: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_visible?: boolean
          name: string
          price_from?: number | null
          price_to?: number | null
          price_unit?: string
          pricing_guide?: Json
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          summary?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_visible?: boolean
          name?: string
          price_from?: number | null
          price_to?: number | null
          price_unit?: string
          pricing_guide?: Json
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_conversation: {
        Args: { _conversation_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "agent" | "customer"
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
      app_role: ["admin", "agent", "customer"],
    },
  },
} as const
