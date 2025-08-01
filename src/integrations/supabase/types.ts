export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      project_deliverables: {
        Row: {
          assigned_to: string[] | null
          completed_date: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          name: string
          priority: string
          project_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string[] | null
          completed_date?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          name: string
          priority?: string
          project_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string[] | null
          completed_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          name?: string
          priority?: string
          project_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_deliverables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          is_completed: boolean
          name: string
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          is_completed?: boolean
          name: string
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          name?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_notifications: {
        Row: {
          created_at: string
          deliverable_id: string | null
          id: string
          is_read: boolean
          message: string
          project_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deliverable_id?: string | null
          id?: string
          is_read?: boolean
          message: string
          project_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deliverable_id?: string | null
          id?: string
          is_read?: boolean
          message?: string
          project_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_notifications_deliverable_id_fkey"
            columns: ["deliverable_id"]
            isOneToOne: false
            referencedRelation: "project_deliverables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          assigned_to: string[] | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          duration: number
          end_date: string
          id: string
          name: string
          priority: string
          progress: number
          project_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string[] | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          duration?: number
          end_date: string
          id?: string
          name: string
          priority?: string
          progress?: number
          project_id: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string[] | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          duration?: number
          end_date?: string
          id?: string
          name?: string
          priority?: string
          progress?: number
          project_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_cost: number
          budget: number
          consultants: string[] | null
          created_at: string
          description: string | null
          end_date: string
          id: string
          name: string
          project_manager: string
          start_date: string
          status: string
          team: string[] | null
          updated_at: string
        }
        Insert: {
          actual_cost?: number
          budget?: number
          consultants?: string[] | null
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          name: string
          project_manager: string
          start_date: string
          status?: string
          team?: string[] | null
          updated_at?: string
        }
        Update: {
          actual_cost?: number
          budget?: number
          consultants?: string[] | null
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          project_manager?: string
          start_date?: string
          status?: string
          team?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          break_end: string | null
          break_start: string | null
          clock_in: string | null
          clock_out: string | null
          created_at: string
          date: string
          employee_id: string
          id: string
          notes: string | null
          status: string
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string
          date?: string
          employee_id: string
          id?: string
          notes?: string | null
          status?: string
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
