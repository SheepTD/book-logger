// import { Link } from "expo-router";
// import { StyleSheet } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import ColorPalette from "../constants/ColorPalette";

// export default function InitialSetup() {
//   return (
//     // if the user is logged in then redirect to the home page
//     // <Redirect href={"/(tabs)/home"} />
//     // else return inital setup page
//     <SafeAreaView style={styles.container}>
//       <Link href="/login" style={styles.primary}>
//         Login
//       </Link>
//     </SafeAreaView>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: ColorPalette.bg,
//   },
//   primary: {
//     backgroundColor: ColorPalette.primary,
//     color: ColorPalette.primaryFont,
//   },
// });

// copied from supabase docs & modified to run as JS not TS
// https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=auth-store&auth-store=async-storage

import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import Auth from "../components/Auth";
import Account from "../components/Account";
import { View } from "react-native";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View>
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
    </View>
  );
}
