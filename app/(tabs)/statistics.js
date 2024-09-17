import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, Pressable } from "react-native";
import Header from "../../components/Header";
import { useState } from "react";
import { TextInput } from "react-native";
import Size from "../../constants/Size";
import ColorPalette from "../../constants/ColorPalette";

export default function Statistics() {
  const [startDate, setStartDate] = useState();
  const [finishDate, setFinishDate] = useState();
  const [loading, setLoading] = useState(false);

  // styles
  const size = Size();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "left",
      alignItems: "left",
      backgroundColor: ColorPalette.bg,
    },
    text: {
      fontSize: size.text,
      color: ColorPalette.text,
    },
    dateInput: {
      height: size.thinHeight,
      padding: size.padding,
      width: "40%",
      backgroundColor: ColorPalette.secondary,
      fontSize: size.text,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header style={{ justifyContent: "space-around" }}>
        <TextInput
          value={startDate}
          onChange={(text) => setStartDate(text)}
          style={styles.dateInput}
          disabled={loading}
          placeholder="start date"
        />
        <TextInput
          value={finishDate}
          onChange={(text) => setFinishDate(text)}
          style={styles.dateInput}
          disabled={loading}
          placeholder="finish date"
        />
      </Header>
    </SafeAreaView>
  );
}
