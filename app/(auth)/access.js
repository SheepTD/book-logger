// TODO: Maybe remove skip button for web as signing out removes all localstorage data

import { StyleSheet, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import ColorPalette from "../../constants/ColorPalette";
import PrimaryBtn from "../../components/PrimaryBtn";
import Size from "../../constants/Size";
import { useState } from "react";

export default function Access() {
  const [loading, setLoading] = useState(false);

  const onLogIn = () => {
    setLoading(true);
    router.push("/(auth)/login");
  };

  const onSignUp = () => {
    setLoading(true);
    router.push("/(auth)/sign-up");
  };

  const onSkipBtn = () => {
    setLoading(true);
  };

  //styles
  const size = Size();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "left",
      backgroundColor: ColorPalette.bg,
    },
    skipPressable: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: size.marginClose,
      backgroundColor: ColorPalette.secondary,
      marginLeft: size.marginLeft,
      width: "40%",
      maxHeight: size.standardHeight,
      minHeight: size.standardHeight,
    },
    text: {
      fontSize: size.text,
    },
    disclaimerContainer: {
      textAlign: "left",
      marginTop: size.marginClose,
      marginLeft: size.marginLeft,
      width: size.standardWidth,
      maxWidth: "70ch", // change to global text width for web
    },
  });

  return (
    // if the user is logged in then redirect to the home page
    // <Redirect href={"/(tabs)/home"} />
    // else return inital setup page
    <SafeAreaView style={styles.container}>
      <PrimaryBtn disabled={loading} onPress={onLogIn} position="static">
        Log In
      </PrimaryBtn>
      <PrimaryBtn disabled={loading} onPress={onSignUp} position="static">
        Sign Up
      </PrimaryBtn>
      <Pressable
        disabled={loading}
        style={styles.skipPressable}
        onPress={onSkipBtn}
      >
        <Text style={styles.text}>Skip</Text>
      </Pressable>
      <View style={styles.disclaimerContainer}>
        <Text style={styles.text}>
          This means that your data will not be saved to the cloud. If you use a
          different device, switch browsers or clear your browser cache your
          data will be lost.
        </Text>
      </View>
    </SafeAreaView>
  );
}
