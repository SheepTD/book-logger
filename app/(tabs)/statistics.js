// TODO: Make sure that statistics don't include books in the 'bin' section

import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import Size from "../../constants/Size";
import ColorPalette from "../../constants/ColorPalette";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Statistics() {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [dateRangePreset, setDateRangePreset] = useState("picker");
  const [booklist, setBooklist] = useState({
    books: [],
    changelog: [],
    latestBookId: 0,
  });
  const [favouriteBook, setFavouriteBook] = useState(null);
  const [favouriteAuthor, setFavouriteAuthor] = useState(null);
  const [favouriteGenre, setFavouriteGenre] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      console.log("Fetching initial data...");
      try {
        const fetchedBooklist = await AsyncStorage.getItem("booklist");
        console.log("Fetched booklist:", fetchedBooklist);
        if (fetchedBooklist === null) {
          const defaultBooklist = {
            books: [],
            changelog: [],
            latestBookId: 0,
          };
          const stringDefaultBooklist = JSON.stringify(defaultBooklist);
          await AsyncStorage.setItem("booklist", stringDefaultBooklist);
          console.log("Saved default booklist");
        } else {
          const parsedBooklist = JSON.parse(fetchedBooklist);
          setBooklist(parsedBooklist);
          console.log("Set booklist:", parsedBooklist);
        }
      } catch (e) {
        console.log("Error fetching booklist data", e);
      }
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    console.log("Updating statistics based on date range...");
    // set all to null if no books
    if (!booklist.books || booklist.books.length === 0) {
      setFavouriteBook(null);
      setFavouriteAuthor(null);
      setFavouriteGenre(null);
      console.log("No books found");
      return;
    }

    const getBooksInDateRange = () => {
      if (!booklist.books || booklist.books.length === 0) {
        return [];
      }

      const filteredBooks = booklist.books.filter((book) => {
        const bookFinishDate = dayjs(book.finishDate);
        const isAfterStartDate =
          bookFinishDate.isAfter(startDate) || bookFinishDate.isSame(startDate);
        const isBeforeEndDate =
          bookFinishDate.isBefore(endDate) || bookFinishDate.isSame(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });

      return filteredBooks;
    };
    const booksInDateRange = getBooksInDateRange();
    console.log("Books in date range:", booksInDateRange);

    // get highest rated book in date range
    let highestRatedBook = null;
    let highestRating = -1;
    booksInDateRange.forEach((book) => {
      const floatRating = parseFloat(book.rating);
      if (floatRating > highestRating) {
        highestRating = floatRating;
        highestRatedBook = book;
      } else if (floatRating === highestRating) {
        const currentBookFinishDate = dayjs(book.finishDate);
        const highestBookFinishDate = dayjs(highestRatedBook.finishDate);
        if (currentBookFinishDate.isAfter(highestBookFinishDate)) {
          highestRatedBook = book;
        }
      }
    });
    setFavouriteBook(highestRatedBook);
    console.log("Favourite book set:", highestRatedBook);

    // get highest ranked author on average in date range
    const getHighestRankedAuthor = () => {
      let highestRankedAuthor = null;
      let highestAverageRating = -1;
      let highestFinishDate = null;
      const authorRatings = {};
      booksInDateRange.forEach((book) => {
        const author = book.author;
        if (!authorRatings[author]) {
          authorRatings[author] = { count: 0, sum: 0 };
        }
        authorRatings[author].sum += parseFloat(book.rating);
        authorRatings[author].count += 1;
      });
      console.log("Author ratings:", authorRatings);
      Object.keys(authorRatings).forEach((author) => {
        const averageRating =
          authorRatings[author].sum / authorRatings[author].count;
        console.log(`${author} average rating: ${averageRating}`);
        if (averageRating > highestAverageRating) {
          highestAverageRating = averageRating;
          highestRankedAuthor = author;
          highestFinishDate = null;
        } else if (averageRating === highestAverageRating) {
          const finishDate = dayjs(
            booksInDateRange.filter((book) => book.author === author)[0]
              .finishDate
          );
          if (!highestFinishDate || finishDate.isAfter(highestFinishDate)) {
            highestFinishDate = finishDate;
            highestRankedAuthor = author;
          }
        }
      });
      console.log("Highest ranked author:", highestRankedAuthor);
      return highestRankedAuthor;
    };

    setFavouriteAuthor(getHighestRankedAuthor());
    console.log("Highest ranked author set:", getHighestRankedAuthor());

    // get highest ranked genre on average in date range
  }, [startDate, endDate, booklist]);

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
    console.log("Finding earliest date...");
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
    console.log("Earliest date found:", earliestDate);
    return earliestDate;
  };

  const onAllTime = () => {
    console.log("Setting date range to all time...");
    setDateRangePreset("all time");
    setStartDate(findEarliestDate());
    setEndDate(dayjs());
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header style={{ justifyContent: "space-around" }}>
        <Pressable
          disabled={loading}
          onPress={() => {
            console.log("Picker date range selected");
            setDateRangePreset("picker");
          }}
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
            console.log("Date range changed", params);
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
      <View style={styles.statContainer}>
        <Text style={styles.text}>Highest Rated Author (on average):</Text>
        <Text style={styles.statText}>
          {favouriteAuthor ? favouriteAuthor : "No books found"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
