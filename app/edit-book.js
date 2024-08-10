import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ColorPalette from "../constants/ColorPalette";
import Size from "../constants/Size";

export default function EditBook() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Header</Text>
      </View>
      <Text>EditBook</Text>
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
  header: {
    position: "absolute",
    flex: 1,
    height: Size.standardHeight,
    width: "100%",
  },
});
