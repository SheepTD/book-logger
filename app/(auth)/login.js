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
    if (usernameOrEmail.length > 0 && password.length > 0) {
      setLoading(true);
      // use edge function to log in
      const { data, error } = await supabase.functions.invoke("login", {
        body: JSON.stringify({
          identifier: usernameOrEmail,
          password: password,
        }),
      });
      if (error) Alert.alert(error.message); // update to work on web
      // set session using auth function:
      const access_token = data.session.access_token;
      const refresh_token = data.session.refresh_token;
      // it has to be inside it's own function so it can use "error" as a
      // variable without clashing with the "error" variable for the edge
      // function.
      const setSession = async (access_token, refresh_token) => {
        const { error } = await supabase.auth.setSession({
          access_token: access_token,
          refresh_token: refresh_token,
        });
        if (error) Alert.alert(error.message); // update to work on web
      };
      await setSession(access_token, refresh_token);
      setLoading(false);
    } else {
      // code to highlight empty input fields
      console.log("empty input fields"); // change this
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Username or Email</Text>
      <TextInput
        style={styles.input}
        cursorColor={ColorPalette.text}
        placeholder="Enter your username or email"
        onChangeText={(text) => setUsernameOrEmail(text)}
        value={usernameOrEmail}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        cursorColor={ColorPalette.text}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "left",
    backgroundColor: ColorPalette.bg,
  },
  input: {
    height: Size.standardHeight,
    marginLeft: Size.marginLeft,
    marginBottom: Size.marginClose,
    padding: 10,
    width: Size.width,
    backgroundColor: ColorPalette.secondary,
    fontSize: Size.text,
  },
  label: {
    fontSize: Size.text,
    marginLeft: Size.marginLeft,
  },
});
