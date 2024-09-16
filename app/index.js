import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { router } from "expo-router";

export default function Index() {
  // redirect user depending on if they are logged in or signed out.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/(tabs)/home");
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/access");
      }
    });
  }, []);
}
