// composables/useSupabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export const useSupabase = () => {
  if (!_client) {
    const config = useRuntimeConfig();
    _client = createClient(
      config.public.supabaseUrl,
      config.public.supabaseKey,
    );
  }
  return _client;
};
