import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import Header from "../../components/Header";
import { useState } from "react";
import { TextInput } from "react-native";
import Size from "../../constants/Size";
import ColorPalette from "../../constants/ColorPalette";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

export default function Statistics() {
  const [endDate, setEndDate] = useState(dayjs()); // set default end date to today
  const [startDate, setStartDate] = useState();
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
      <Header style={{ justifyContent: "space-around" }}></Header>
      <DateTimePicker
        mode="range"
        startDate={startDate}
        endDate={endDate}
        onChange={(params) => {
          setStartDate(params.startDate);
          setEndDate(params.endDate);
        }}
        firstDayOfWeek={1}
      />
    </SafeAreaView>
  );
}
