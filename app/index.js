import { Link, Redirect } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ColorPalette from "../constants/ColorPalette";

export default function InitialSetup() {
  return (
    // if the user is logged in then redirect to the home page
    // <Redirect href={"/(tabs)/home"} />
    // else return inital setup page
    <SafeAreaView style={styles.container}>
      <Link href="/login" style={styles.primary}>
        Login
      </Link>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ColorPalette.bg,
  },
  primary: {
    backgroundColor: ColorPalette.primary,
    color: ColorPalette.primaryFont,
  },
});
