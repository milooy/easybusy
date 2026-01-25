import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const createSupabaseClient = (): SupabaseClient<Database> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === "undefined") {
      // SSR placeholder - 실제 서버에서는 supabase-server.ts 사용
      return createBrowserClient<Database>("https://placeholder.supabase.co", "placeholder");
    }
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

export type Database = {
  public: {
    Tables: {
      folders: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          folder_id: string | null;
          url: string;
          title: string | null;
          description: string | null;
          favicon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          folder_id?: string | null;
          url: string;
          title?: string | null;
          description?: string | null;
          favicon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          folder_id?: string | null;
          url?: string;
          title?: string | null;
          description?: string | null;
          favicon?: string | null;
          created_at?: string;
        };
      };
      bookmark_tags: {
        Row: {
          bookmark_id: string;
          tag_id: string;
        };
        Insert: {
          bookmark_id: string;
          tag_id: string;
        };
        Update: {
          bookmark_id?: string;
          tag_id?: string;
        };
      };
      google_tokens: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          access_token: string;
          refresh_token: string;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          access_token: string;
          refresh_token: string;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          access_token?: string;
          refresh_token?: string;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export const supabase = createSupabaseClient();
