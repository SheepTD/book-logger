// copied from supabase docs & modified to run as JS not TS
// https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=auth-store&auth-store=async-storage
// has been updated to use "log in" not "sign in", have a username option and use the Deno edge function for login
// hcpatcha react native wrapper and related code copied from here:
// https://github.com/hCaptcha/react-native-hcaptcha/blob/master/Example.App.js

import React, { useRef, useState } from "react";
import { Alert, StyleSheet, View, AppState, Platform } from "react-native";
import { supabase } from "../utils/supabase";
import { Button, Input } from "@rneui/themed";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha"; // react native hcaptcha wrapper

// data for hcaptcha
const siteKey = "88645a4a-ab88-4636-bd88-45b2ed7606d2";
const baseUrl = "https://hcaptcha.com"; // only needed for react native wrapper

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  // hcaptcha state
  const [captchaToken, setCaptchaToken] = useState();

  // reference for resetting hcaptcha
  const captchaRef = useRef();

  async function logInWithEmail() {
    setLoading(true);
    // use edge function to log in
    const { data, error } = await supabase.functions.invoke("login", {
      body: JSON.stringify({
        identifier: username,
        password: password,
      }),
    });
    if (error) Alert.alert(error.message);
    // set session using auth function
    // It has to be inside it's own function so it can use "error" as a
    // variable without clashing with the "error" variable for the edge
    // function.
    const access_token = data.session.access_token;
    const refresh_token = data.session.refresh_token;
    const setSession = async (access_token, refresh_token) => {
      const { error } = await supabase.auth.setSession({
        access_token: access_token,
        refresh_token: refresh_token,
      });
      if (error) Alert.alert(error.message);
    };
    await setSession(access_token, refresh_token);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
        // hcaptcha data
        captchaToken,
      },
    });
    // reset the hcaptcha on web
    if (Platform.OS === "web") {
      captchaRef.current.resetCaptcha();
    }
    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert(
        "Code run successfully but session not returned. Try restarting the app and trying again" // potentially change this error message
      );
    setLoading(false);
  }

  // only for hcaptcha wrapper
  // The callback function that runs after receiving a response, error, or when user cancels the captcha
  const onMessage = (event) => {
    if (event && event.nativeEvent.data) {
      if (["cancel"].includes(event.nativeEvent.data)) {
        captchaRef.current.hide();
        console.log("Captcha cancelled");
      } else if (["error", "expired"].includes(event.nativeEvent.data)) {
        captchaRef.current.hide();
        console.log(
          "Captcha encountered error or expired:",
          event.nativeEvent.data
        );
      } else if (event.nativeEvent.data === "open") {
        console.log("Visual challenge opened");
      } else {
        console.log("Verified code from hCaptcha");
        captchaRef.current.hide();
        setCaptchaToken(event.nativeEvent.data);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Username"
          leftIcon={{ type: "font-awesome", name: "user" }}
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Username"
          autoCapitalize={"none"}
        />
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      {Platform.OS === "web" ? (
        <HCaptcha
          ref={captchaRef}
          sitekey={siteKey}
          onVerify={(token) => {
            setCaptchaToken(token);
          }}
        />
      ) : null}
      {Platform.OS !== "web" ? (
        <>
          <ConfirmHcaptcha
            ref={captchaRef}
            siteKey={siteKey}
            baseUrl={baseUrl}
            languageCode="en" // find a way to change this depending on user's language settings
            onMessage={onMessage}
          />
          <Button
            onPress={() => {
              captchaRef.current.show();
            }}
            title={"Show Captcha"}
          />
        </>
      ) : null}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Log in"
          disabled={loading}
          onPress={() => logInWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
