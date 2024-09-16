import { View, Text, StyleSheet } from "react-native";
// import { supabase } from "../../utils/supabase";

export default function Home() {
  // for testing only
  // async function signOut() {
  //   const { error } = await supabase.auth.signOut();
  // }
  // signOut();

  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
