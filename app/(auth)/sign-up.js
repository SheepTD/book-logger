// TODO:
// make button change colour based on loading
// console.logs and alerts to be configured
// need to indicate when the user has forgotten to fill out a field when they press the Sign Up button. Could chang sign up button colour?
// reload entire page or reset captcha after failed sign up

import {
  Text,
  StyleSheet,
  TextInput,
  Platform,
  AppState,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import validator from "validator";
import ColorPalette from "../../constants/ColorPalette";
import Size from "../../constants/Size";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";
import { supabase } from "../../utils/supabase";
import PrimaryBtn from "../../components/PrimaryBtn";

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

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  // credentials state
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // reminder state
  const [usernameReminder, setUsernameReminder] = useState("");
  const [nameReminder, setNameReminder] = useState("");
  const [emailReminder, setEmailReminder] = useState("");
  const [passwordReminder, setPasswordReminder] = useState("");
  const [confirmPasswordReminder, setConfirmPasswordReminder] = useState("");
  // credential validity state
  const [validUsername, setValidUsername] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [validCaptchaToken, setValidCaptchaToken] = useState(false);
  // hcaptcha state
  const [captchaToken, setCaptchaToken] = useState();

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
    captchaBtn: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: size.marginClose,
      backgroundColor: ColorPalette.secondary,
      marginLeft: size.marginLeft,
      width: "40%",
      maxHeight: size.standardHeight,
      minHeight: size.standardHeight,
      marginBottom: size.marginClose,
    },
    validCaptchaBtn: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: size.marginClose,
      backgroundColor: ColorPalette.green,
      marginLeft: size.marginLeft,
      width: "40%",
      maxHeight: size.standardHeight,
      minHeight: size.standardHeight,
      marginBottom: size.marginClose,
    },
    btnText: {
      fontSize: size.text,
    },
    reminder: {
      fontSize: size.text,
      marginLeft: size.marginLeft,
      color: ColorPalette.red,
      marginBottom: size.marginFar,
    },
    blank: {
      display: "none",
    },
  });

  // username reminder useEffect
  useEffect(() => {
    async function usernameUseEffect() {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("username", username.toLowerCase());
      if (error) {
        console.log("error:", error); // change or add alert
      }

      if (username === "") {
        setValidUsername(false);
        setUsernameReminder("");
      } else if (username.length < 3 || username.length > 30) {
        setValidUsername(false);
        setUsernameReminder("Username must be 3 to 30 characters long.");
      } else if (/[A-Z]/.test(username)) {
        setValidUsername(false);
        setUsernameReminder("Username must be lowercase.");
      } else if (/[a-z]/.test(username) === false) {
        setValidUsername(false);
        setUsernameReminder("Username must contain at least one letter");
      } else if (/^[a-zA-Z0-9_-]+$/.test(username) === false) {
        setValidUsername(false);
        setUsernameReminder(
          "Username must not contain any spaces or special characters expect for underscores and dashes"
        );
      } else if (error === null && data.length > 0) {
        setValidUsername(false);
        setUsernameReminder("Username is already in use.");
      } else {
        setValidUsername(true);
        setUsernameReminder("");
      }
    }

    usernameUseEffect();
  }, [username, setUsernameReminder]);

  // name reminder useEffect
  useEffect(() => {
    if (name === "") {
      setValidName(false);
      setNameReminder("");
    } else if (name.length < 1 || name.length > 30) {
      setValidName(false);
      setNameReminder("Name must be 1 to 30 characters long"); // change this depending on how many ch can be displayed within a friend element
    } else if (name.trim().length === 0) {
      setValidName(false);
      setNameReminder(
        "Name must contain at least one character (not including spaces)"
      );
    } else {
      setValidName(true);
      setNameReminder("");
    }
  }, [name, setNameReminder]);

  // email reminder useEffect
  useEffect(() => {
    if (email === "") {
      setValidEmail(false);
      setEmailReminder("");
    } else if (email.length > 254) {
      setValidEmail(false);
      setEmailReminder("Email is invalid");
    } else if (validator.isEmail(email) !== true) {
      setValidEmail(false);
      setEmailReminder("Email is invalid");
    } else {
      setValidEmail(true);
      setEmailReminder("");
    }
  }, [email, setEmailReminder]);

  // password reminder useEffect
  useEffect(() => {
    if (password === "") {
      setValidPassword(false);
      setPasswordReminder("");
    } else if (password.length < 8 || password.length > 30) {
      setValidPassword(false);
      setPasswordReminder("Password must be 8 to 30 characters long.");
    } else if (/[a-zA-Z]/.test(password) === false) {
      setValidPassword(false);
      setPasswordReminder("Password must contain at least one letter.");
    } else if (/\d/.test(password) === false) {
      setValidPassword(false);
      setPasswordReminder("Password must contain at least one number");
    } else {
      setValidPassword(true);
      setPasswordReminder("");
    }
  }, [password, setPasswordReminder]);

  // confirm password reminder useEffect
  useEffect(() => {
    if (password === "") {
      setValidConfirmPassword(false);
      setConfirmPasswordReminder("");
    } else if (confirmPassword !== password) {
      setValidConfirmPassword(false);
      setConfirmPasswordReminder("Passwords entered do not match.");
    } else {
      setValidConfirmPassword(true);
      setConfirmPasswordReminder("");
    }
  }, [password, confirmPassword, setConfirmPasswordReminder]);

  // reference for resetting hcaptcha
  const captchaRef = useRef();

  // sign up user with lower case email
  async function signUpWithEmail() {
    setLoading(true);
    if (
      validUsername &&
      validName &&
      validPassword &&
      validPassword &&
      validConfirmPassword &&
      captchaToken
    ) {
      const noEmail =
        "noemail." + username + ".noemail@noemail." + username + ".noemail";
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: validEmail ? email : noEmail,
        password: password,
        options: {
          data: {
            username: username.toLowerCase(),
            name: name,
          },
          // hcaptcha data
          captchaToken,
        },
      });
      // reset the hcaptcha on web
      if (Platform.OS === "web") {
        captchaRef.current.resetCaptcha();
      }
      if (error) Alert.alert(error.message); // change this to work for web
      console.log(error); // change this
      if (!error && !session)
        Alert.alert(
          "Code run successfully but session not returned. Try restarting the application." // potentially change this error message
        );
    } else {
      // code for invalid inputs or captcha tokens i.e. alert
      console.log("invalid inputs"); // change this
    }
    setLoading(false);
  }

  // only for hcaptcha wrapper
  // The callback function that runs after receiving a response, error, or when user cancels the captcha
  const onMessage = (event) => {
    if (event && event.nativeEvent.data) {
      if (["cancel"].includes(event.nativeEvent.data)) {
        captchaRef.current.hide();
        console.log("Captcha cancelled"); // change this
      } else if (["error", "expired"].includes(event.nativeEvent.data)) {
        captchaRef.current.hide();
        console.log(
          "Captcha encountered error or expired:",
          event.nativeEvent.data
        ); // change this
      } else if (event.nativeEvent.data === "open") {
        console.log("Visual challenge opened"); // change this
      } else {
        console.log("Verified code from hCaptcha");
        setValidCaptchaToken(true);
        captchaRef.current.hide();
        setCaptchaToken(event.nativeEvent.data);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Enter username"
        onChangeText={(text) => setUsername(text)}
        value={username}
        autoCapitalize="none"
      />
      <Text style={usernameReminder !== "" ? styles.reminder : styles.blank}>
        {usernameReminder}
      </Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Enter your name"
        onChangeText={(text) => setName(text)}
        value={name}
        autoCapitalize="words"
      />
      <Text style={nameReminder !== "" ? styles.reminder : styles.blank}>
        {nameReminder}
      </Text>
      <Text style={styles.label}>Email (Optional)</Text>
      <TextInput
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Enter your email address"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize="none"
      />
      <Text style={emailReminder !== "" ? styles.reminder : styles.blank}>
        {emailReminder}
      </Text>
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Enter password"
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <Text style={passwordReminder !== "" ? styles.reminder : styles.blank}>
        {passwordReminder}
      </Text>
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Repeat Password"
        autoCapitalize="none"
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
        secureTextEntry={true}
      />
      <Text
        style={confirmPasswordReminder !== "" ? styles.reminder : styles.blank}
      >
        {confirmPasswordReminder}
      </Text>
      <Text style={styles.label}>Captcha</Text>
      {Platform.OS === "web" ? (
        <HCaptcha
          ref={captchaRef}
          sitekey={siteKey}
          onVerify={(token) => {
            setValidCaptchaToken(true);
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
          <Pressable
            style={
              validCaptchaToken ? styles.validCaptchaBtn : styles.captchaBtn
            }
            onPress={() => {
              captchaRef.current.show();
            }}
            title={"Show Captcha"}
          >
            <Text style={styles.btnText}>HCaptcha</Text>
          </Pressable>
        </>
      ) : null}
      <PrimaryBtn onPress={signUpWithEmail} disabled={loading}>
        Sign Up
      </PrimaryBtn>
    </SafeAreaView>
  );
}
