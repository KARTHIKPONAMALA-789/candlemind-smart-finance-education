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
      attendance: {
        Row: {
          attendance_time: string
          attended: boolean
          id: string
          live_class_id: string
          student_id: string
        }
        Insert: {
          attendance_time?: string
          attended?: boolean
          id?: string
          live_class_id: string
          student_id: string
        }
        Update: {
          attendance_time?: string
          attended?: boolean
          id?: string
          live_class_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_live_class_id_fkey"
            columns: ["live_class_id"]
            isOneToOne: false
            referencedRelation: "live_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcasts: {
        Row: {
          created_at: string
          id: string
          message: string
          priority: string
          title: string
          tutor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          priority?: string
          title: string
          tutor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          priority?: string
          title?: string
          tutor_id?: string
        }
        Relationships: []
      }
      brokers: {
        Row: {
          account_opening_time: string | null
          active: boolean
          badges: string[]
          best_for: string | null
          brokerage: string
          created_at: string
          description: string
          display_order: number
          features: string[]
          id: string
          logo_url: string | null
          min_deposit: string | null
          name: string
          rating: number
          referral_url: string
          slug: string
          supports_delivery: boolean
          supports_intraday: boolean
          supports_margin: boolean
          supports_options: boolean
          updated_at: string
        }
        Insert: {
          account_opening_time?: string | null
          active?: boolean
          badges?: string[]
          best_for?: string | null
          brokerage: string
          created_at?: string
          description: string
          display_order?: number
          features?: string[]
          id?: string
          logo_url?: string | null
          min_deposit?: string | null
          name: string
          rating?: number
          referral_url: string
          slug: string
          supports_delivery?: boolean
          supports_intraday?: boolean
          supports_margin?: boolean
          supports_options?: boolean
          updated_at?: string
        }
        Update: {
          account_opening_time?: string | null
          active?: boolean
          badges?: string[]
          best_for?: string | null
          brokerage?: string
          created_at?: string
          description?: string
          display_order?: number
          features?: string[]
          id?: string
          logo_url?: string | null
          min_deposit?: string | null
          name?: string
          rating?: number
          referral_url?: string
          slug?: string
          supports_delivery?: boolean
          supports_intraday?: boolean
          supports_margin?: boolean
          supports_options?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty: string
          id: string
          published: boolean
          thumbnail: string | null
          title: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          published?: boolean
          thumbnail?: string | null
          title: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          published?: boolean
          thumbnail?: string | null
          title?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed: boolean
          course_id: string
          id: string
          joined_at: string
          progress_percentage: number
          student_id: string
        }
        Insert: {
          completed?: boolean
          course_id: string
          id?: string
          joined_at?: string
          progress_percentage?: number
          student_id: string
        }
        Update: {
          completed?: boolean
          course_id?: string
          id?: string
          joined_at?: string
          progress_percentage?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      live_classes: {
        Row: {
          class_title: string
          created_at: string
          duration_min: number
          id: string
          meeting_link: string | null
          scheduled_date: string
          tutor_id: string
        }
        Insert: {
          class_title: string
          created_at?: string
          duration_min?: number
          id?: string
          meeting_link?: string | null
          scheduled_date: string
          tutor_id: string
        }
        Update: {
          class_title?: string
          created_at?: string
          duration_min?: number
          id?: string
          meeting_link?: string | null
          scheduled_date?: string
          tutor_id?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          duration_min: number | null
          id: string
          order_number: number
          pdf_url: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          duration_min?: number | null
          id?: string
          order_number?: number
          pdf_url?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          duration_min?: number | null
          id?: string
          order_number?: number
          pdf_url?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_trades: {
        Row: {
          buy_price: number
          created_at: string
          current_price: number
          id: string
          profit_loss: number | null
          quantity: number
          status: string
          stock_name: string
          student_id: string
          ticker: string
        }
        Insert: {
          buy_price: number
          created_at?: string
          current_price: number
          id?: string
          profit_loss?: number | null
          quantity: number
          status?: string
          stock_name: string
          student_id: string
          ticker: string
        }
        Update: {
          buy_price?: number
          created_at?: string
          current_price?: number
          id?: string
          profit_loss?: number | null
          quantity?: number
          status?: string
          stock_name?: string
          student_id?: string
          ticker?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          consistency_score: number
          created_at: string
          full_name: string | null
          id: string
          streak: number
          updated_at: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          consistency_score?: number
          created_at?: string
          full_name?: string | null
          id: string
          streak?: number
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          consistency_score?: number
          created_at?: string
          full_name?: string | null
          id?: string
          streak?: number
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          completed_at: string
          id: string
          quiz_id: string
          score: number
          student_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          quiz_id: string
          score: number
          student_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          quiz_id?: string
          score?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          correct_answer: number
          created_at: string
          id: string
          module_id: string
          options: Json
          question: string
        }
        Insert: {
          correct_answer: number
          created_at?: string
          id?: string
          module_id: string
          options: Json
          question: string
        }
        Update: {
          correct_answer?: number
          created_at?: string
          id?: string
          module_id?: string
          options?: Json
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_clicks: {
        Row: {
          broker_id: string
          created_at: string
          device: string | null
          id: string
          ip_hash: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          broker_id: string
          created_at?: string
          device?: string | null
          id?: string
          ip_hash?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          broker_id?: string
          created_at?: string
          device?: string | null
          id?: string
          ip_hash?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_clicks_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_conversions: {
        Row: {
          broker_id: string
          id: string
          notes: string | null
          reported_at: string
          status: string
          user_id: string
        }
        Insert: {
          broker_id: string
          id?: string
          notes?: string | null
          reported_at?: string
          status?: string
          user_id: string
        }
        Update: {
          broker_id?: string
          id?: string
          notes?: string | null
          reported_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_conversions_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
        ]
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
      watchlist: {
        Row: {
          created_at: string
          id: string
          ticker: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ticker: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ticker?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "tutor" | "admin"
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
      app_role: ["student", "tutor", "admin"],
    },
  },
} as const
