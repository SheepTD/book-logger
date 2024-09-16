// TODO:
// add code to highlight empty fields
// change button colour based on loading

import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ColorPalette from "../../constants/ColorPalette";
import { TextInput } from "react-native";
import Size from "../../constants/Size";
import PrimaryBtn from "../../components/PrimaryBtn";
import { useState } from "react";
import { supabase } from "../../utils/supabase";
import { Alert } from "react-native";

export default function Login() {
  const [loading, setLoading] = useState(false);
  // credential state
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  // log in function
  const logIn = async () => {
    console.log("log in pressed"); // remove this
    if (usernameOrEmail.length > 0 && password.length > 0) {
      setLoading(true);
      // use edge function to log in
      const { data, error } = await supabase.functions.invoke("login", {
        body: JSON.stringify({
          identifier: usernameOrEmail,
          password: password,
        }),
      });
      console.log("supabase function invoked"); // remove this
      if (error) {
        Alert.alert(error.message); // update to work on web
        console.log(error.message);
      }
      // set session using auth function:
      const access_token = data.session.access_token;
      const refresh_token = data.session.refresh_token;
      console.log("access token:", access_token); // remove this
      console.log("refresh token:", refresh_token); // remove this
      // it has to be inside it's own function so it can use "error" as a
      // variable without clashing with the "error" variable for the edge
      // function.
      const setSession = async (access_token, refresh_token) => {
        const { error } = await supabase.auth.setSession({
          access_token: access_token,
          refresh_token: refresh_token,
        });
        console.log("supabase set session invoked");
        if (error) {
          Alert.alert(error.message); // update to work on web
          console.log(error.message); // remove this
        }
      };
      await setSession(access_token, refresh_token);
      setLoading(false);
    } else {
      // code to highlight empty input fields
      console.log("empty input fields"); // change this
    }
  };

  const size = Size();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "left",
      backgroundColor: ColorPalette.bg,
    },
    input: {
      height: size.standardHeight,
      marginLeft: size.marginLeft,
      marginBottom: size.marginClose,
      padding: 10,
      width: size.standardWidth,
      backgroundColor: ColorPalette.secondary,
      fontSize: size.text,
    },
    label: {
      fontSize: size.text,
      marginLeft: size.marginLeft,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Username or Email</Text>
      <TextInput
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Enter your username or email"
        onChangeText={(text) => setUsernameOrEmail(text)}
        value={usernameOrEmail}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Enter your password"
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <PrimaryBtn onPress={logIn} disabled={loading}>
        Log In
      </PrimaryBtn>
    </SafeAreaView>
  );
}
