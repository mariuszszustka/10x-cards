export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  extensions: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      pg_stat_statements: {
        Row: {
          blk_read_time: number | null;
          blk_write_time: number | null;
          calls: number | null;
          dbid: unknown | null;
          jit_emission_count: number | null;
          jit_emission_time: number | null;
          jit_functions: number | null;
          jit_generation_time: number | null;
          jit_inlining_count: number | null;
          jit_inlining_time: number | null;
          jit_optimization_count: number | null;
          jit_optimization_time: number | null;
          local_blks_dirtied: number | null;
          local_blks_hit: number | null;
          local_blks_read: number | null;
          local_blks_written: number | null;
          max_exec_time: number | null;
          max_plan_time: number | null;
          mean_exec_time: number | null;
          mean_plan_time: number | null;
          min_exec_time: number | null;
          min_plan_time: number | null;
          plans: number | null;
          query: string | null;
          queryid: number | null;
          rows: number | null;
          shared_blks_dirtied: number | null;
          shared_blks_hit: number | null;
          shared_blks_read: number | null;
          shared_blks_written: number | null;
          stddev_exec_time: number | null;
          stddev_plan_time: number | null;
          temp_blk_read_time: number | null;
          temp_blk_write_time: number | null;
          temp_blks_read: number | null;
          temp_blks_written: number | null;
          toplevel: boolean | null;
          total_exec_time: number | null;
          total_plan_time: number | null;
          userid: unknown | null;
          wal_bytes: number | null;
          wal_fpi: number | null;
          wal_records: number | null;
        };
        Relationships: [];
      };
      pg_stat_statements_info: {
        Row: {
          dealloc: number | null;
          stats_reset: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      algorithm_sign: {
        Args: { signables: string; secret: string; algorithm: string };
        Returns: string;
      };
      armor: {
        Args: { "": string };
        Returns: string;
      };
      dearmor: {
        Args: { "": string };
        Returns: string;
      };
      gen_random_bytes: {
        Args: { "": number };
        Returns: string;
      };
      gen_random_uuid: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      gen_salt: {
        Args: { "": string };
        Returns: string;
      };
      pg_stat_statements: {
        Args: { showtext: boolean };
        Returns: Record<string, unknown>[];
      };
      pg_stat_statements_info: {
        Args: Record<PropertyKey, never>;
        Returns: Record<string, unknown>;
      };
      pg_stat_statements_reset: {
        Args: { userid?: unknown; dbid?: unknown; queryid?: number };
        Returns: undefined;
      };
      pgp_armor_headers: {
        Args: { "": string };
        Returns: Record<string, unknown>[];
      };
      pgp_key_id: {
        Args: { "": string };
        Returns: string;
      };
      sign: {
        Args: { payload: Json; secret: string; algorithm?: string };
        Returns: string;
      };
      try_cast_double: {
        Args: { inp: string };
        Returns: number;
      };
      url_decode: {
        Args: { data: string };
        Returns: string;
      };
      url_encode: {
        Args: { data: string };
        Returns: string;
      };
      uuid_generate_v1: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      uuid_generate_v1mc: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      uuid_generate_v3: {
        Args: { namespace: string; name: string };
        Returns: string;
      };
      uuid_generate_v4: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      uuid_generate_v5: {
        Args: { namespace: string; name: string };
        Returns: string;
      };
      uuid_nil: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      uuid_ns_dns: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      uuid_ns_oid: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      uuid_ns_url: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      uuid_ns_x500: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      verify: {
        Args: { token: string; secret: string; algorithm?: string };
        Returns: {
          header: Json;
          payload: Json;
          valid: boolean;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      flashcard_learning_progress: {
        Row: {
          id: number;
          user_id: string;
          flashcard_id: number;
          leitner_box: number;
          last_reviewed_at: string | null;
          next_review_at: string | null;
          consecutive_correct_answers: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          flashcard_id: number;
          leitner_box?: number;
          last_reviewed_at?: string | null;
          next_review_at?: string | null;
          consecutive_correct_answers?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          flashcard_id?: number;
          leitner_box?: number;
          last_reviewed_at?: string | null;
          next_review_at?: string | null;
          consecutive_correct_answers?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flashcard_learning_progress_flashcard_id_fkey";
            columns: ["flashcard_id"];
            isOneToOne: false;
            referencedRelation: "flashcards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flashcard_learning_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      flashcards: {
        Row: {
          back: string;
          created_at: string;
          front: string;
          generation_id: number | null;
          id: number;
          source: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          back: string;
          created_at?: string;
          front: string;
          generation_id?: number | null;
          id?: number;
          source: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          back?: string;
          created_at?: string;
          front?: string;
          generation_id?: number | null;
          id?: number;
          source?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flashcards_generation_id_fkey";
            columns: ["generation_id"];
            isOneToOne: false;
            referencedRelation: "generations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flashcards_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      generation_error_logs: {
        Row: {
          created_at: string;
          error_code: string;
          error_message: string;
          id: number;
          model: string;
          source_text_hash: string;
          source_text_length: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          error_code: string;
          error_message: string;
          id?: number;
          model: string;
          source_text_hash: string;
          source_text_length: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          error_code?: string;
          error_message?: string;
          id?: number;
          model?: string;
          source_text_hash?: string;
          source_text_length?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "generation_error_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      generations: {
        Row: {
          accepted_edited_count: number;
          accepted_unedited_count: number;
          created_at: string;
          generated_count: number;
          generation_duration: number;
          id: number;
          model: string;
          source_text_hash: string;
          source_text_length: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          accepted_edited_count?: number;
          accepted_unedited_count?: number;
          created_at?: string;
          generated_count?: number;
          generation_duration: number;
          id?: number;
          model: string;
          source_text_hash: string;
          source_text_length: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          accepted_edited_count?: number;
          accepted_unedited_count?: number;
          created_at?: string;
          generated_count?: number;
          generation_duration?: number;
          id?: number;
          model?: string;
          source_text_hash?: string;
          source_text_length?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "generations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      review_history: {
        Row: {
          id: number;
          user_id: string;
          flashcard_id: number;
          is_correct: boolean;
          previous_box: number;
          new_box: number;
          review_time_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          flashcard_id: number;
          is_correct: boolean;
          previous_box: number;
          new_box: number;
          review_time_ms?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          flashcard_id?: number;
          is_correct?: boolean;
          previous_box?: number;
          new_box?: number;
          review_time_ms?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "review_history_flashcard_id_fkey";
            columns: ["flashcard_id"];
            isOneToOne: false;
            referencedRelation: "flashcards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "review_history_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      review_sessions: {
        Row: {
          id: number;
          user_id: string;
          started_at: string;
          completed_at: string | null;
          cards_reviewed: number;
          correct_answers: number;
          incorrect_answers: number;
          total_review_time_ms: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          started_at?: string;
          completed_at?: string | null;
          cards_reviewed?: number;
          correct_answers?: number;
          incorrect_answers?: number;
          total_review_time_ms?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          started_at?: string;
          completed_at?: string | null;
          cards_reviewed?: number;
          correct_answers?: number;
          incorrect_answers?: number;
          total_review_time_ms?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "review_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          confirmed_at: string | null;
          created_at: string;
          email: string;
          encrypted_password: string;
          id: string;
        };
        Insert: {
          confirmed_at?: string | null;
          created_at?: string;
          email: string;
          encrypted_password: string;
          id?: string;
        };
        Update: {
          confirmed_at?: string | null;
          created_at?: string;
          email?: string;
          encrypted_password?: string;
          id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_next_review_date: {
        Args: { leitner_box: number };
        Returns: string;
      };
      unaccent: {
        Args: { "": string };
        Returns: string;
      };
      unaccent_init: {
        Args: { "": unknown };
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          level: number | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          level?: number | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          level?: number | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      prefixes: {
        Row: {
          bucket_id: string;
          created_at: string | null;
          level: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          bucket_id: string;
          created_at?: string | null;
          level?: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          bucket_id?: string;
          created_at?: string | null;
          level?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey";
            columns: ["upload_id"];
            isOneToOne: false;
            referencedRelation: "s3_multipart_uploads";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string };
        Returns: undefined;
      };
      can_insert_object: {
        Args: { bucketid: string; name: string; owner: string; metadata: Json };
        Returns: undefined;
      };
      delete_prefix: {
        Args: { _bucket_id: string; _name: string };
        Returns: boolean;
      };
      extension: {
        Args: { name: string };
        Returns: string;
      };
      filename: {
        Args: { name: string };
        Returns: string;
      };
      foldername: {
        Args: { name: string };
        Returns: string[];
      };
      get_level: {
        Args: { name: string };
        Returns: number;
      };
      get_prefix: {
        Args: { name: string };
        Returns: string;
      };
      get_prefixes: {
        Args: { name: string };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
      search_legacy_v1: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
      search_v1_optimised: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
      search_v2: {
        Args: {
          prefix: string;
          bucket_name: string;
          limits?: number;
          levels?: number;
          start_after?: string;
        };
        Returns: {
          key: string;
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  extensions: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  storage: {
    Enums: {},
  },
} as const;
