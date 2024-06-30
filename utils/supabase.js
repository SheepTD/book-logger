import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fnlgjxjtaqotrjiunpxt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubGdqeGp0YXFvdHJqaXVucHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5OTY5NzEsImV4cCI6MjAzMzU3Mjk3MX0.2aHII_GhMgikQ4WoUMndqozfMIRDGXBcwAgbVM9m4Ms";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
