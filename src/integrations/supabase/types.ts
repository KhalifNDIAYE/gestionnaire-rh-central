export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      communication_announcements: {
        Row: {
          author_id: string
          author_name: string
          content: string
          created_at: string
          expiration_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          meeting_date: string | null
          meeting_location: string | null
          priority: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          author_id: string
          author_name: string
          content: string
          created_at?: string
          expiration_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          meeting_date?: string | null
          meeting_location?: string | null
          priority?: number
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          author_name?: string
          content?: string
          created_at?: string
          expiration_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          meeting_date?: string | null
          meeting_location?: string | null
          priority?: number
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      communication_settings: {
        Row: {
          autoplay: boolean
          carousel_duration: number
          id: string
          updated_at: string
        }
        Insert: {
          autoplay?: boolean
          carousel_duration?: number
          id?: string
          updated_at?: string
        }
        Update: {
          autoplay?: boolean
          carousel_duration?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          company: string | null
          created_at: string
          department: string
          email: string
          end_date: string | null
          fonction: string
          hourly_rate: number | null
          id: string
          name: string
          salary: number | null
          start_date: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          department: string
          email: string
          end_date?: string | null
          fonction: string
          hourly_rate?: number | null
          id?: string
          name: string
          salary?: number | null
          start_date: string
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          department?: string
          email?: string
          end_date?: string | null
          fonction?: string
          hourly_rate?: number | null
          id?: string
          name?: string
          salary?: number | null
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_functions: {
        Row: {
          created_at: string
          department: string
          description: string
          id: string
          level: string
          permissions: string[]
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department: string
          description: string
          id?: string
          level?: string
          permissions?: string[]
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string
          description?: string
          id?: string
          level?: string
          permissions?: string[]
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          employee_name: string
          end_date: string
          id: string
          manager_comment: string | null
          reason: string
          start_date: string
          status: string
          submitted_at: string
          type: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          employee_name: string
          end_date: string
          id?: string
          manager_comment?: string | null
          reason: string
          start_date: string
          status?: string
          submitted_at?: string
          type: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          employee_name?: string
          end_date?: string
          id?: string
          manager_comment?: string | null
          reason?: string
          start_date?: string
          status?: string
          submitted_at?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      memorandums: {
        Row: {
          author_id: string
          author_name: string
          category: string
          content: string
          created_at: string
          id: string
          priority: string
          status: string
          target_audience: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          author_name: string
          category: string
          content: string
          created_at?: string
          id?: string
          priority: string
          status?: string
          target_audience?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          author_name?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          priority?: string
          status?: string
          target_audience?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      validation_steps: {
        Row: {
          action: string
          comment: string | null
          id: string
          level: number
          memorandum_id: string
          timestamp: string
          validator_id: string
          validator_name: string
          validator_role: string
        }
        Insert: {
          action: string
          comment?: string | null
          id?: string
          level: number
          memorandum_id: string
          timestamp?: string
          validator_id: string
          validator_name: string
          validator_role: string
        }
        Update: {
          action?: string
          comment?: string | null
          id?: string
          level?: number
          memorandum_id?: string
          timestamp?: string
          validator_id?: string
          validator_name?: string
          validator_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_steps_memorandum_id_fkey"
            columns: ["memorandum_id"]
            isOneToOne: false
            referencedRelation: "memorandums"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
