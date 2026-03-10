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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string
          created_at: string
          farmer_id: string | null
          id: string
          message: string
          severity: string
          source_disease: string | null
          status: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          farmer_id?: string | null
          id?: string
          message: string
          severity: string
          source_disease?: string | null
          status?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          farmer_id?: string | null
          id?: string
          message?: string
          severity?: string
          source_disease?: string | null
          status?: string
        }
        Relationships: []
      }
      crop_logs: {
        Row: {
          confidence: number | null
          created_at: string
          crop: string
          farmer_id: string | null
          id: string
          risk: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          crop: string
          farmer_id?: string | null
          id?: string
          risk?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          crop?: string
          farmer_id?: string | null
          id?: string
          risk?: string | null
        }
        Relationships: []
      }
      disease_logs: {
        Row: {
          confidence: number | null
          created_at: string
          disease: string
          farmer_id: string | null
          id: string
          severity: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          disease: string
          farmer_id?: string | null
          id?: string
          severity?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          disease?: string
          farmer_id?: string | null
          id?: string
          severity?: string | null
        }
        Relationships: []
      }
      farmers: {
        Row: {
          district: string
          email: string
          id: string
          land_size: number | null
          mandal: string | null
          name: string
          phone: string
          preferred_language: string | null
          registered_at: string
          soil_type: string | null
          state: string
          user_id: string | null
        }
        Insert: {
          district: string
          email: string
          id?: string
          land_size?: number | null
          mandal?: string | null
          name: string
          phone: string
          preferred_language?: string | null
          registered_at?: string
          soil_type?: string | null
          state: string
          user_id?: string | null
        }
        Update: {
          district?: string
          email?: string
          id?: string
          land_size?: number | null
          mandal?: string | null
          name?: string
          phone?: string
          preferred_language?: string | null
          registered_at?: string
          soil_type?: string | null
          state?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fertilizer_logs: {
        Row: {
          created_at: string
          farmer_id: string | null
          fertilizer: string
          id: string
        }
        Insert: {
          created_at?: string
          farmer_id?: string | null
          fertilizer: string
          id?: string
        }
        Update: {
          created_at?: string
          farmer_id?: string | null
          fertilizer?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      worker_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          description: string
          difficulty: number | null
          id: string
          required_level: number | null
          status: string | null
          title: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description: string
          difficulty?: number | null
          id?: string
          required_level?: number | null
          status?: string | null
          title: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string
          difficulty?: number | null
          id?: string
          required_level?: number | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          accuracy_rate: number | null
          assigned_tasks: string[] | null
          available: boolean | null
          completed_tasks: number | null
          district: string
          email: string
          id: string
          level: number | null
          name: string
          phone: string
          registered_at: string
          skills: string[] | null
        }
        Insert: {
          accuracy_rate?: number | null
          assigned_tasks?: string[] | null
          available?: boolean | null
          completed_tasks?: number | null
          district: string
          email: string
          id?: string
          level?: number | null
          name: string
          phone: string
          registered_at?: string
          skills?: string[] | null
        }
        Update: {
          accuracy_rate?: number | null
          assigned_tasks?: string[] | null
          available?: boolean | null
          completed_tasks?: number | null
          district?: string
          email?: string
          id?: string
          level?: number | null
          name?: string
          phone?: string
          registered_at?: string
          skills?: string[] | null
        }
        Relationships: []
      }
      yield_logs: {
        Row: {
          created_at: string
          farmer_id: string | null
          id: string
          predicted_yield: number | null
          risk: string | null
        }
        Insert: {
          created_at?: string
          farmer_id?: string | null
          id?: string
          predicted_yield?: number | null
          risk?: string | null
        }
        Update: {
          created_at?: string
          farmer_id?: string | null
          id?: string
          predicted_yield?: number | null
          risk?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "farmer"
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
      app_role: ["admin", "farmer"],
    },
  },
} as const
