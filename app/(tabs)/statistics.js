// TODO: add friends added stat once friends page is setup

import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import Size from "../../constants/Size";
import ColorPalette from "../../constants/ColorPalette";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

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
  const [booksRead, setBooksRead] = useState(0);
  // const [friendsAdded, setFriendsAdded] = useState(0);
  const [mostReadInYear, setMostReadInYear] = useState(0);
  const [mostReadInYearDate, setMostReadInYearDate] = useState(null);

  const [mostReadInMonth, setMostReadInMonth] = useState(0);
  const [mostReadInMonthDate, setMostReadInMonthDate] = useState(null);

  const [daysSinceBookStartedFinished, setDaysSinceBookStartedFinished] =
    useState(0);

  useFocusEffect(
    React.useCallback(() => {
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
    }, [])
  );

  useEffect(() => {
    console.log("Updating statistics based on date range...");
    // set all to null if no books
    if (!booklist.books || booklist.books.length === 0) {
      setFavouriteBook(null);
      setFavouriteAuthor(null);
      setFavouriteGenre(null);
      setBooksRead(0);
      setMostReadInYear(0);
      setMostReadInMonth(0);
      setDaysSinceBookStartedFinished(0);
      console.log("No books found");
      return;
    }

    // get books finished
    const getBooksFinished = () => {
      if (!booklist.books || booklist.books.length === 0) {
        return [];
      }

      const booksFinished = booklist.books.filter(
        (book) => book.finishDate && book.section !== "Bin"
      );

      return booksFinished;
    };
    const booksFinished = getBooksFinished();
    console.log("Books finished:", booksFinished);

    // get most read in year

    // get most read in month
    const getMostReadInMonth = () => {
      let mostReadInMonth = 0;
      let mostReadInMonthDate = null;
      if (booksFinished.length === 0) {
        console.log("No books finished");
        return [mostReadInMonth, mostReadInMonthDate];
      }
      const months = {};
      booksFinished.forEach((book) => {
        const finishDate = dayjs(book.finishDate);
        const month = finishDate.month();
        if (!months[month]) {
          months[month] = 0;
        }
        months[month]++;
      });
      console.log("Months:", months);
      Object.keys(months).forEach((month) => {
        console.log(`Checking month ${month}`);
        if (months[month] > mostReadInMonth) {
          console.log(`Updating most read in month to ${months[month]}`);
          mostReadInMonth = months[month];
          mostReadInMonthDate = dayjs().month(parseInt(month)).startOf("month");
        } else if (months[month] === mostReadInMonth) {
          console.log("Month is equal to the current most read in month");
          const currentMonth = dayjs().month(parseInt(month));
          if (currentMonth.isAfter(mostReadInMonthDate)) {
            console.log("Updating most read in month date");
            mostReadInMonthDate = currentMonth;
          }
        }
      });
      console.log(
        "Most read in month:",
        mostReadInMonth,
        mostReadInMonthDate ? mostReadInMonthDate.format("MMMM YYYY") : ""
      );
      setMostReadInMonth(mostReadInMonth);
      setMostReadInMonthDate(
        mostReadInMonthDate ? mostReadInMonthDate.format("MMMM YYYY") : ""
      );
    };

    getMostReadInMonth();

    // get days since book started or finished
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
        return isAfterStartDate && isBeforeEndDate && book.section !== "Bin";
      });

      return filteredBooks;
    };
    const booksInDateRange = getBooksInDateRange();
    console.log("Books in date range:", booksInDateRange);

    // get total number of books read in date range
    setBooksRead(booksInDateRange.length);
    console.log("Books read:", booksRead);

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
    const getHighestRankedGenre = () => {
      let highestRankedGenre = null;
      let highestAverageRating = -1;
      let highestFinishDate = null;
      const genreRatings = {};
      booksInDateRange.forEach((book) => {
        const genre = book.genre;
        if (!genreRatings[genre]) {
          genreRatings[genre] = { count: 0, sum: 0 };
        }
        genreRatings[genre].sum += parseFloat(book.rating);
        genreRatings[genre].count += 1;
      });
      console.log("Genre ratings:", genreRatings);
      Object.keys(genreRatings).forEach((genre) => {
        const averageRating =
          genreRatings[genre].sum / genreRatings[genre].count;
        console.log(`${genre} average rating: ${averageRating}`);
        if (averageRating > highestAverageRating) {
          highestAverageRating = averageRating;
          highestRankedGenre = genre;
          highestFinishDate = null;
        } else if (averageRating === highestAverageRating) {
          const finishDate = dayjs(
            booksInDateRange.filter((book) => book.genre === genre)[0]
              .finishDate
          );
          if (!highestFinishDate || finishDate.isAfter(highestFinishDate)) {
            highestFinishDate = finishDate;
            highestRankedGenre = genre;
          }
        }
      });
      console.log("Highest ranked genre:", highestRankedGenre);
      return highestRankedGenre;
    };

    setFavouriteGenre(getHighestRankedGenre());
    console.log("Highest ranked genre set:", getHighestRankedGenre());

    // get total number of friends added in date range (coming soon...)
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
      marginBottom: size.marginClose,
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
      <View style={styles.statContainer}>
        <Text style={styles.text}>Highest Rated Genre (on average):</Text>
        <Text style={styles.statText}>
          {favouriteGenre ? favouriteGenre : "No books found"}
        </Text>
      </View>
      <View style={styles.statContainer}>
        <Text style={styles.text}>Books Read:</Text>
        <Text style={styles.statText}>
          {booksRead ? booksRead : "No books found"}
        </Text>
      </View>
      <View style={styles.statContainer}>
        <Text style={styles.text}>
          Most books read in a month:{" "}
          {mostReadInMonthDate ? mostReadInMonthDate : "No books found"}
        </Text>
        <Text style={styles.statText}>
          {mostReadInMonth ? mostReadInMonth : "No books found"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
