import { Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import ColorPalette from "../constants/ColorPalette";
import Size from "../constants/Size";
import { Link } from "expo-router";

export default function PrimaryBtn({
  onPress,
  href,
  position,
  disabled,
  children,
}) {
  const btnPosition = position ? position : "absolute";
  const marginLeft = position ? Size.marginLeft : 0;
  const marginBottom = position ? Size.marginClose : 0;
  const left = position ? 0 : Size.marginLeft;
  const bottom = position ? 0 : Size.marginClose;

  const styles = StyleSheet.create({
    container: {
      position: btnPosition,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: Size.width,
      maxHeight: Size.standardHeight,
      minHeight: Size.standardHeight,
      backgroundColor: ColorPalette.primary,
      left: left,
      bottom: bottom,
      marginLeft: marginLeft,
      marginBottom: marginBottom,
    },
    text: {
      color: ColorPalette.primaryText,
      fontSize: Size.text,
    },
  });

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable disabled={disabled} style={styles.container}>
          <Text style={styles.text}>{children}</Text>
        </Pressable>
      </Link>
    );
  } else {
    return (
      <Pressable onPress={onPress} style={styles.container}>
        <Text style={styles.text}>{children}</Text>
      </Pressable>
    );
  }
}
