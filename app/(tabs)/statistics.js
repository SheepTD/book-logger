import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { TextInput } from "react-native";
import Size from "../../constants/Size";
import ColorPalette from "../../constants/ColorPalette";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Statistics() {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs()); // set default end date to today
  const [loading, setLoading] = useState(false);
  const [dateRangePreset, setDateRangePreset] = useState("picker");
  const [booklist, setBooklist] = useState({
    books: [],
    changelog: [],
    latestBookId: 0,
  });
  const [favouriteBook, setFavouriteBook] = useState("");

  // console log dates
  useEffect(() => {
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
  }, [startDate, endDate]);

  // console log btn date range presets
  useEffect(() => {
    console.log("date range preset: ", dateRangePreset);
  }, [dateRangePreset]);

  // fetch booklist on initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const fetchedBooklist = await AsyncStorage.getItem("booklist");
        console.log("Fetched booklist:", fetchedBooklist); // remove this
        if (fetchedBooklist === null) {
          const defaultBooklist = {
            books: [],
            changelog: [],
            latestBookId: 0,
          };
          const stringDefaultBooklist = JSON.stringify(defaultBooklist);
          await AsyncStorage.setItem("booklist", stringDefaultBooklist);
          console.log("Saved booklist:", stringDefaultBooklist);
          // don't need to update the booklist useState because it is already set to the default
        } else {
          const parsedBooklist = JSON.parse(fetchedBooklist);
          setBooklist(parsedBooklist);
        }
      } catch (e) {
        console.log("Error fetching booklist data", e); // change this
      }
    };
    fetchInitialData();
  }, []);

  // update statistics whenever start and end dates change
  useEffect(() => {
    let highestRatedBook = null;
    let highestRating = -1;

    booklist.books.forEach((book) => {
      if (book.rating > highestRating) {
        highestRating = book.rating;
        highestRatedBook = book;
      } else if (book.rating === highestRating) {
        const currentBookFinishDate = dayjs(book.finishDate);
        const highestBookFinishDate = dayjs(highestRatedBook.finishDate);
        if (currentBookFinishDate.isAfter(highestBookFinishDate)) {
          highestRatedBook = book;
        }
      }
    });
    setFavouriteBook(highestRatedBook);
  }, [startDate, endDate, booklist]);

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
    dateRangePresetBtn: {
      backgroundColor: ColorPalette.secondary,
      padding: size.padding,
    },
    statContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "flex-start",
      backgroundColor: ColorPalette.secondary,
      maxHeight: size.standardHeight,
      width: size.standardWidth,
      marginLeft: size.marginLeft,
    },
    statText: {
      fontSize: size.header,
      color: ColorPalette.text,
    },
  });

  const findEarliestDate = () => {
    let earliestDate = null;
    booklist.books.forEach((currentBook) => {
      const currentStartDate = currentBook.startDate;
      const currentFinishDate = currentBook.finishDate;

      if (earliestDate === null || currentStartDate < earliestDate) {
        earliestDate = currentStartDate;
      }
      if (earliestDate === null || currentFinishDate < earliestDate) {
        earliestDate = currentFinishDate;
      }
    });
    return earliestDate;
  };

  const onAllTime = () => {
    console.log("all time pressed");
    setDateRangePreset("all time");
    // set earliest date as start date and today as end date
    setStartDate(findEarliestDate);
    setEndDate(dayjs());
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header style={{ justifyContent: "space-around" }}>
        <Pressable
          disabled={loading}
          onPress={() => setDateRangePreset("picker")}
          style={
            dateRangePreset === "picker"
              ? [
                  styles.dateRangePresetBtn,
                  { backgroundColor: ColorPalette.primary },
                ]
              : styles.dateRangePresetBtn
          }
        >
          <Text>Pick date range</Text>
        </Pressable>
        <Pressable
          disabled={loading}
          onPress={onAllTime}
          style={
            dateRangePreset === "all time"
              ? [
                  styles.dateRangePresetBtn,
                  { backgroundColor: ColorPalette.primary },
                ]
              : styles.dateRangePresetBtn
          }
        >
          <Text>All Time</Text>
        </Pressable>
      </Header>
      {dateRangePreset === "picker" ? (
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
      ) : null}
      <View style={styles.statContainer}>
        <Text style={styles.text}>Highest Rated Book:</Text>
        <Text style={styles.statText}>
          {favouriteBook ? favouriteBook.title : "No books found"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
