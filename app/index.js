import { View, Text } from "react-native";
import { Redirect } from "expo-router";

export default function InitialSetup() {
  return (
    // if the user is logged in then redirect to the home page
    <Redirect href={"/(tabs)/home"} />
    // else return inital setup page
  );
}
