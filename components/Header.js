import React from "react";
import { View, StyleSheet } from "react-native";
import Size from "../constants/Size";
import ColorPalette from "../constants/ColorPalette";

export default function Header({ styling, children }) {
  const size = Size();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      maxHeight: size.headerHeight,
      width: "100%",
      backgroundColor: ColorPalette.tabBar,
      marginBottom: size.marginClose,
    },
  });

  return <View style={[styles.container, styling]}>{children}</View>;
}
