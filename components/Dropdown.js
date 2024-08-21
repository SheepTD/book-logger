// import { Text, StyleSheet, Pressable, View } from "react-native";
// import React, { useState } from "react";
// import { ScrollView } from "react-native";
// import Size from "../constants/Size";
// import ColorPalette from "../constants/ColorPalette";

// export default function Dropdown({
//   placeholder,
//   items,
//   height,
//   marginBottom,
//   onSet,
// }) {
//   // styles
//   const size = Size();
//   const [viewHeight, setViewHeight] = useState(size.thinHeight);
//   const [scrollViewDisplay, setScrollViewDisplay] = useState("none");
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: "flex-start",
//       alignItems: "flex-start",
//       marginLeft: size.marginLeft,
//       marginBottom: marginBottom,
//       width: size.standardWidth,
//       backgroundColor: "green",
//       // maxHeight: viewHeight,
//     },
//     scrollViewContainer: {
//       display: scrollViewDisplay,
//       maxHeight: height,
//       // flex: 1,
//       // justifyContent: "flex-start",
//       // alignItems: "flex-start",
//       // width: size.standardWidth,
//       // backgroundColor: ColorPalette.secondary,
//     },
//     scrollView: {
//       flexGrow: 1,
//     },
//     button: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "flex-start",
//       padding: size.padding,
//       backgroundColor: ColorPalette.green,
//       width: size.standardWidth,
//       minHeight: size.thinHeight,
//       // maxHeight: size.thinHeight,
//     },
//     text: {
//       fontSize: size.text,
//       color: ColorPalette.text,
//     },
//     item: {
//       height: 20,
//     },
//   });

//   const onItemPress = (value) => {
//     onSet(value);
//   };

//   const onOpenDropdown = () => {
//     if (viewHeight === size.thinHeight) {
//       setViewHeight(height);
//     } else {
//       setViewHeight(size.thinHeight);
//     }

//     if (scrollViewDisplay === "none") {
//       setScrollViewDisplay("flex");
//     } else {
//       setScrollViewDisplay("none");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Pressable style={styles.button} onPress={onOpenDropdown}>
//         <Text style={styles.text}>{placeholder}</Text>
//       </Pressable>
//       <ScrollView contentContainerStyle={styles.scrollView}>
//         {items.map((el, index) => (
//           <Pressable key={index} onPress={onItemPress(el)}>
//             <Text key={index} style={styles.item}>
//               {el}
//             </Text>
//           </Pressable>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

import {
  Text,
  StyleSheet,
  Pressable,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import Size from "../constants/Size";
import ColorPalette from "../constants/ColorPalette";

export default function Dropdown({
  placeholder,
  items,
  height,
  marginBottom,
  onSet,
}) {
  const size = Size();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(placeholder);
  const [isAddGenre, setIsAddGenre] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    if (onSet) onSet(option);
  };

  const handleAddGenre = () => {
    if (inputValue.trim()) {
      setSelectedOption(inputValue);
      setIsDropdownOpen(false);
      if (onSet) onSet(inputValue);
      setInputValue("");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginLeft: size.marginLeft,
      marginBottom: marginBottom,
      width: size.standardWidth,
      backgroundColor: ColorPalette.red,
      maxHeight: height,
    },
    button: {
      justifyContent: "center",
      alignItems: "flex-start",
      padding: size.padding,
      backgroundColor: ColorPalette.green,
      width: size.standardWidth,
      minHeight: size.thinHeight,
    },
    text: {
      fontSize: size.text,
      color: ColorPalette.text,
    },
    scrollViewContainer: {
      maxHeight: height - size.thinHeight,
    },
    scrollView: {
      flexGrow: 1,
    },
    item: {
      padding: size.padding,
      fontSize: size.text,
      color: ColorPalette.text,
      backgroundColor: ColorPalette.secondary,
      width: size.standardWidth,
    },
    input: {
      padding: size.padding,
      margin: size.margin,
      fontSize: size.text,
      backgroundColor: ColorPalette.secondary,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable style={styles.button} onPress={toggleDropdown}>
        <Text style={styles.text}>{selectedOption}</Text>
      </Pressable>
      {isDropdownOpen && (
        <View style={styles.scrollViewContainer}>
          <ScrollView style={styles.scrollView}>
            {items.map((el, index) => (
              <Pressable key={index} onPress={() => handleSelectOption(el)}>
                <Text style={styles.item}>{el}</Text>
              </Pressable>
            ))}
            <View>
              {isAddGenre ? (
                <TextInput
                  style={styles.input}
                  cursorColor={ColorPalette.cursor}
                  placeholder="Enter new genre"
                  onChangeText={(text) => setInputValue(text)}
                  value={inputValue}
                  autoCapitalize="words"
                  onSubmitEditing={handleAddGenre}
                  returnKeyType="done"
                />
              ) : (
                <Pressable
                  style={styles.item}
                  onPress={() => setIsAddGenre(!isAddGenre)}
                >
                  <Text style={styles.text}>Add Genre</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
