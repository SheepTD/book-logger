// TODO:
// Add functions to handle if booklist or selected book id are null i.e. they have not been saved to Async Storage yet
// Genre related functionality: retrive genres from save, add and save new genre
// Add validitiy checks and warning to all inputs
// Update layout to match the design

import { Text, StyleSheet, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ColorPalette from "../constants/ColorPalette";
import Size from "../constants/Size";
import { useEffect, useState } from "react";
import PrimaryBtn from "../components/PrimaryBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Header from "../components/Header";
import dayjs from "dayjs";

export default function EditBook() {
  // AsyncStorage state
  const [booklist, setBooklist] = useState({
    books: [],
    changelog: [],
    latestBookId: 0,
  });
  const [selectedBookId, setSelectedBookId] = useState(0);
  // input state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState();
  const [review, setReview] = useState("");
  const [section, setSection] = useState("Reading");
  // loading state
  const [loading, setLoading] = useState(false);

  // fetch data on initial load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let parsedBooklist; // declared outside of the "try/accept" to be used "if" statement
      try {
        const stringBooklist = await AsyncStorage.getItem("booklist");
        console.log("Fetched booklist:", stringBooklist); // remove this
        parsedBooklist = JSON.parse(stringBooklist);
        setBooklist(parsedBooklist);
      } catch (e) {
        console.log("Error fetching booklist data:", e); // change this
      }
      let parsedSelectedBookId; // declared outside of the "try/accept" to be used "if" statement
      try {
        const stringSelectedBookId = await AsyncStorage.getItem(
          "selected-book-id"
        );
        console.log("Fetched selected book id:", stringSelectedBookId);
        parsedSelectedBookId = JSON.parse(stringSelectedBookId);
        setSelectedBookId(parsedSelectedBookId);
      } catch (e) {
        console.log("Error fetching selected book id:", e);
      }
      // update inputs if selected book id is not 0
      if (parsedSelectedBookId !== 0 && parsedSelectedBookId !== null) {
        console.log("Selected Book Id is not set to 0 or null");
        // Filter out the selected book
        const selectedBook = parsedBooklist.books.find(
          (item) => item.id === parsedSelectedBookId
        );
        if (!selectedBook) {
          console.log("Book not found");
          setLoading(false);
          return;
        }
        setTitle(selectedBook.title);
        setAuthor(selectedBook.author);
        setStartDate(selectedBook.startDate);
        setFinishDate(selectedBook.finishDate);
        setGenre(selectedBook.genre);
        setRating(selectedBook.rating);
        setReview(selectedBook.review);
        setSection(selectedBook.section);
      } else {
        console.log("Selected book id is set to 0  or null");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // styles
  const size = Size();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "left",
      alignItems: "left",
      backgroundColor: ColorPalette.bg,
    },

    input: {
      height: size.thinHeight,
      marginLeft: size.marginLeft,
      marginBottom: size.marginClose,
      padding: size.padding,
      width: size.standardWidth,
      backgroundColor: ColorPalette.secondary,
      fontSize: size.text,
    },
    label: {
      fontSize: size.text,
      marginLeft: size.marginLeft,
    },
    datesContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginLeft: size.marginLeft,
      marginBottom: size.marginClose,
      width: size.standardWidth,
      maxHeight: size.thinHeight,
    },
    dateInput: {
      height: size.thinHeight,
      padding: size.padding,
      width: 0.475 * size.standardWidth,
      backgroundColor: ColorPalette.secondary,
      fontSize: size.text,
    },
    sectionContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginLeft: size.marginLeft,
      minHeight: size.standardHeight,
      maxHeight: size.standardHeight,
      width: size.standardWidth,
    },
    sectionBtn: {
      backgroundColor: ColorPalette.secondary,
      padding: size.padding,
    },
  });

  // reset selected book id and rediredt to booklist page
  const onCancel = async () => {
    console.log("Cancel pressed"); // remove this
    await setLoading(true);
    const stringUpdatedSelectedBookId = JSON.stringify(0);
    try {
      await AsyncStorage.setItem(
        "selected-book-id",
        stringUpdatedSelectedBookId
      );
      console.log(
        "Selected book id has been saved:",
        stringUpdatedSelectedBookId
      ); // remove this
    } catch (e) {
      console.log("Error saving selected book id:", e); // change this
    }
    router.replace("/(tabs)/booklist");
  };

  // save selected book id and booklist, then redirect back to booklist page
  const onSaveBook = async () => {
    console.log("Save book pressed"); // remove this
    await setLoading(true);
    let updatedBooklist = booklist;
    // test if dates are working
    console.log("startDate:", startDate);
    console.log("finishDate:", finishDate);
    // format dates
    const formattedStartDate = dayjs()
      .set("year", startDate.split("/")[2])
      .set("month", startDate.split("/")[1] - 1) // months start at 0
      .set("date", startDate.split("/")[0]);
    const formattedFinishDate = dayjs()
      .set("year", finishDate.split("/")[2])
      .set("month", finishDate.split("/")[1] - 1) // montsh start at 0
      .set("date", finishDate.split("/")[0]);
    // test formatted dates
    console.log("formattedStartDate", formattedStartDate);
    console.log("formattedFinishDate", formattedFinishDate);
    // remove the old version of the book if editing
    if (selectedBookId !== 0 && selectedBookId !== null) {
      console.log("Selected book id is not equal to 0 or null");
      updatedBooklist.books = booklist.books.filter(
        (item) => item.id !== selectedBookId
      );
      updatedBooklist.books.push({
        title: title,
        author: author,
        startDate: formattedStartDate,
        finishDate: formattedFinishDate,
        genre: genre,
        rating: rating,
        review: review,
        section: section,
        id: updatedBooklist.latestBookId,
      });
    } else {
      updatedBooklist.latestBookId += 1;
      updatedBooklist.books.push({
        title: title,
        author: author,
        startDate: formattedStartDate,
        finishDate: formattedFinishDate,
        genre: genre,
        rating: rating,
        review: review,
        section: section,
        id: updatedBooklist.latestBookId,
      });
    }
    const stringUpdatedSelectedBookId = JSON.stringify(0);
    const stringUpdatedBooklist = JSON.stringify(updatedBooklist);
    try {
      await AsyncStorage.setItem(
        "selected-book-id",
        stringUpdatedSelectedBookId
      );
      console.log(
        "Selected book id has been saved:",
        stringUpdatedSelectedBookId
      ); // remove this
    } catch (e) {
      console.log("Error saving selected book id:", e); // change this
    }
    try {
      await AsyncStorage.setItem("booklist", stringUpdatedBooklist);
      console.log("Booklist has been saved:", stringUpdatedBooklist); // remove this
    } catch (e) {
      console.log("Error saving booklist:", e); // change this
    }
    console.log("Redirecting to the Booklist Page"); // remove this
    router.replace("/(tabs)/booklist");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header>
        <Pressable onPress={onCancel} disabled={loading}>
          <Text>Cancel</Text>
        </Pressable>
      </Header>
      <Text style={styles.label}>Title</Text>
      <TextInput
        disabled={loading}
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Enter title"
        onChangeText={(text) => setTitle(text)}
        value={title}
        autoCapitalize="words"
      />
      <Text style={styles.label}>Author</Text>
      <TextInput
        disabled={loading}
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Enter author"
        onChangeText={(text) => setAuthor(text)}
        value={author}
        autoCapitalize="words"
      />
      <Text style={styles.label}>Dates</Text>
      <View style={styles.datesContainer}>
        <TextInput
          disabled={loading}
          style={styles.dateInput}
          cursorColor={ColorPalette.cursor}
          placeholder="Enter start date"
          onChangeText={(text) => setStartDate(text)}
          value={startDate}
          autoCapitalize="none"
        />
        <TextInput
          disabled={loading}
          style={styles.dateInput}
          cursorColor={ColorPalette.cursor}
          placeholder="Enter finish date"
          onChangeText={(text) => setFinishDate(text)}
          value={finishDate}
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.label}>Genre</Text>
      <TextInput
        disabled={loading}
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Enter genre"
        onChangeText={(text) => setGenre(text)}
        value={genre}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Rating</Text>
      <TextInput
        disabled={loading}
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Enter rating from 1 to 10"
        onChangeText={(text) => setRating(text)}
        value={rating}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Review</Text>
      <TextInput
        disabled={loading}
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Write review here"
        onChangeText={(text) => setReview(text)}
        value={review}
        autoCapitalize="sentences"
      />

      <View style={styles.sectionContainer}>
        <Pressable
          disabled={loading}
          onPress={() => setSection("Reading")}
          style={
            section === "Reading"
              ? [styles.sectionBtn, { backgroundColor: ColorPalette.primary }]
              : styles.sectionBtn
          }
        >
          <Text>Reading</Text>
        </Pressable>
        <Pressable
          disabled={loading}
          onPress={() => setSection("Want to Read")}
          style={
            section === "Want to Read"
              ? [styles.sectionBtn, { backgroundColor: ColorPalette.primary }]
              : styles.sectionBtn
          }
        >
          <Text>Want to Read</Text>
        </Pressable>
        <Pressable
          disabled={loading}
          onPress={() => setSection("Read")}
          style={
            section === "Read"
              ? [styles.sectionBtn, { backgroundColor: ColorPalette.primary }]
              : styles.sectionBtn
          }
        >
          <Text>Read</Text>
        </Pressable>
      </View>

      <PrimaryBtn onPress={onSaveBook} disabled={loading}>
        Save Book
      </PrimaryBtn>
    </SafeAreaView>
  );
}
