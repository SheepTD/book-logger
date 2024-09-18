import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import ColorPalette from "../../constants/ColorPalette";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryBtn from "../../components/PrimaryBtn";
import Size from "../../constants/Size";
import { Text } from "react-native";
import Header from "../../components/Header";
import dayjs from "dayjs";

// const deleteEverything = async () => {
//   let keys = [];
//   try {
//     keys = await AsyncStorage.getAllKeys();
//   } catch (e) {
//     // read key error
//   }

//   console.log(keys);
//   // example console.log result:
//   // ['@MyApp_user', '@MyApp_key']

//   try {
//     await AsyncStorage.multiRemove(keys);
//   } catch (e) {
//     // remove error
//   }

//   console.log("Everything Deleted!");
// };
// deleteEverything();

export default function Booklist() {
  const [booklist, setBooklist] = useState({
    books: [],
    changelog: [],
    latestBookId: 0,
  });
  // NOTE: selected book id is not needed because it doesn't affect what happens on this page
  const [loading, setLoading] = useState(false);

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

  // log booklist on update - remove this
  useEffect(() => {
    console.log("booklist:", booklist);
  }, [booklist]);

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

    bookContainer: {
      flex: 1,
      width: size.standardWidth,
      // height: size.standardHeight,
      backgroundColor: ColorPalette.secondary,
      marginBottom: size.marginClose,
      marginLeft: size.marginLeft,
    },
    bookListContainer: {
      width: "100%",
      maxHeight: "80%",
    },
    heading: {
      fontSize: size.headingText,
      marginLeft: size.marginLeft,
      marginBottom: size.marginClose,
    },
    bookBtnsContainer: {
      flex: 1,
      maxHeight: size.standardHeight,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
  });

  // switch the section of the book and then async storage
  const onBinBook = async (bookId) => {
    console.log("Bin btn pressed");
    console.log("Book Id:", bookId);
    setLoading(true);
    // Filter out the book to be moved to the "Bin"
    const bookToMove = booklist.books.find((item) => item.id === bookId);
    if (!bookToMove) {
      console.log("Book not found");
      setLoading(false);
      return;
    }
    // Create the new book list excluding the book to be moved
    const newBooks = booklist.books.filter((item) => item.id !== bookId);
    // Update the section of the book to "Bin" and add it to the list
    bookToMove.restoreSection = bookToMove.section;
    bookToMove.section = "Bin";
    newBooks.push(bookToMove);
    // Convert the updated book list to a string for storage
    const stringBooklist = JSON.stringify({
      books: newBooks,
      changelog: booklist.changelog,
      latestBookId: booklist.latestBookId,
    });
    try {
      await AsyncStorage.setItem("booklist", stringBooklist);
      console.log("Saved booklist:", stringBooklist);
    } catch (e) {
      console.log("Error saving booklist:", e); // Changed error logging
    }
    setBooklist({
      books: newBooks,
      changelog: booklist.changelog,
      latestBookId: booklist.latestBookId,
    });
    setLoading(false);
  };

  // remove book from array
  const onPermDelete = async (bookId) => {
    console.log("Permanent Delete btn pressed");
    console.log("Book Id:", bookId);
    setLoading(true);
    // Create the new book list excluding the book to be removed
    const newBooks = booklist.books.filter((item) => item.id !== bookId);
    // Convert the updated book list to a string for storage
    const stringBooklist = JSON.stringify({
      books: newBooks,
      changelog: booklist.changelog,
      latestBookId: booklist.latestBookId,
    });
    try {
      await AsyncStorage.setItem("booklist", stringBooklist);
      console.log("Saved booklist:", stringBooklist);
    } catch (e) {
      console.log("Error saving booklist:", e); // Changed this
    }
    setBooklist({
      books: newBooks,
      changelog: booklist.changelog,
      latestBookId: booklist.latestBookId,
    });
    setLoading(false);
  };

  // move book back to original section
  const onRestore = async (bookId) => {
    console.log("Restore btn pressed");
    console.log("Book Id:", bookId);
    setLoading(true);
    const newBooks = booklist.books.filter((item) => item.id !== bookId);
    // Filter out the book to be moved to the "Bin"
    const bookToMove = booklist.books.find((item) => item.id === bookId);
    if (!bookToMove) {
      console.log("Book not found");
      setLoading(false);
      return;
    }
    // Update the section of the book to it's original setting
    bookToMove.section = bookToMove.restoreSection;
    delete bookToMove.restoreSection;
    newBooks.push(bookToMove);
    // Convert the updated book list to a string for storage
    const stringBooklist = JSON.stringify({
      books: newBooks,
      changelog: booklist.changelog,
      latestBookId: booklist.latestBookId,
    });
    try {
      await AsyncStorage.setItem("booklist", stringBooklist);
      console.log("Saved booklist:", stringBooklist);
    } catch (e) {
      console.log("Error saving booklist:", e); // Changed this
    }
    setBooklist({
      books: newBooks,
      changelog: booklist.changelog,
      latestBookId: booklist.latestBookId,
    });
    setLoading(false);
  };

  // update selected book id and redirect to the edit book page
  const onEditBook = async (bookId) => {
    console.log("Edit btn pressed");
    console.log("Book Id:", bookId);
    setLoading(true);
    const stringSelectedBookId = JSON.stringify(bookId);
    try {
      await AsyncStorage.setItem("selected-book-id", stringSelectedBookId);
      console.log("Saved selected book id:", stringSelectedBookId);
    } catch (e) {
      console.log("Error saving selected book id:", e); // Changed this
    }
    console.log("Redirecting to edit-book page");
    router.replace("edit-book");
    setLoading(false);
  };

  // add book function
  const onAddBook = async () => {
    console.log("Add book pressed"); // remove this
    setLoading(true);
    const stringSelectedBookId = JSON.stringify(0);
    try {
      await AsyncStorage.setItem("selected-book-id", stringSelectedBookId);
      console.log("Saved selected book id:", stringSelectedBookId);
    } catch (e) {
      console.log("Error saving selected book id:", e);
    }
    console.log("Redirecting to edit-book page");
    router.replace("edit-book");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header>
        <Text>Header</Text>
      </Header>
      <ScrollView style={styles.bookListContainer}>
        <Text style={styles.heading}>Recommended</Text>
        {booklist.books.map((value, index) => {
          if (value.section === "Recommended") {
            return (
              <View key={index} style={styles.bookContainer}>
                <Text key={"title" + index}>{value.title}</Text>
                <Text key={"author" + index}>{value.author}</Text>
                <Text key={"genre" + index}>{value.genre}</Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Review</Text>
                  <Text key={"rating" + index}>{value.rating + "/10"}</Text>
                </View>
                <Text key={"message" + index}>{value.message}</Text>
              </View>
            );
          }
        })}
        <Text style={styles.heading}>Reading</Text>
        {booklist.books.map((value, index) => {
          if (value.section === "Reading") {
            const formattedStartDate = dayjs(value.startDate).format(
              "D/M/YYYY"
            );
            return (
              <View key={index} style={styles.bookContainer}>
                <Text key={"title" + index}>{value.title}</Text>
                <Text key={"author" + index}>{value.author}</Text>
                <Text key={"startDate" + index}>
                  {formattedStartDate + " - " + "N/A"}
                </Text>
                <Text key={"genre" + index}>{value.genre}</Text>
                <View style={styles.bookBtnsContainer}>
                  <Pressable
                    disabled={loading}
                    onPress={() => onEditBook(value.id)}
                  >
                    <Text>Edit</Text>
                  </Pressable>
                  <Pressable
                    disabled={loading}
                    onPress={() => onBinBook(value.id)}
                  >
                    <Text>Bin</Text>
                  </Pressable>
                </View>
              </View>
            );
          }
        })}
        <Text style={styles.heading}>Want to Read</Text>
        {booklist.books.map((value, index) => {
          if (value.section === "Want to Read") {
            return (
              <View key={index} style={styles.bookContainer}>
                <Text key={"title" + index}>{value.title}</Text>
                <Text key={"author" + index}>{value.author}</Text>
                <Text key={"genre" + index}>{value.genre}</Text>
                <View style={styles.bookBtnsContainer}>
                  <Pressable
                    disabled={loading}
                    onPress={() => onEditBook(value.id)}
                  >
                    <Text>Edit</Text>
                  </Pressable>
                  <Pressable
                    disabled={loading}
                    onPress={() => onBinBook(value.id)}
                  >
                    <Text>Bin</Text>
                  </Pressable>
                </View>
              </View>
            );
          }
        })}
        <Text style={styles.heading}>Read</Text>
        {booklist.books.map((value, index) => {
          if (value.section === "Read") {
            const formattedStartDate = dayjs(value.startDate).format(
              "D/M/YYYY"
            );
            const formattedFinishDate = dayjs(value.finishDate).format(
              "D/M/YYYY"
            );
            return (
              <View key={index} style={styles.bookContainer}>
                <Text key={"title" + index}>{value.title}</Text>
                <Text key={"author" + index}>{value.author}</Text>
                <Text key={"dates" + index}>
                  {formattedStartDate + " - " + formattedFinishDate}
                </Text>
                <Text key={"genre" + index}>{value.genre}</Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Review</Text>
                  <Text key={"rating" + index}>{value.rating + "/10"}</Text>
                </View>
                <Text key={"review" + index}>{value.review}</Text>
                <View style={styles.bookBtnsContainer}>
                  <Pressable
                    disabled={loading}
                    onPress={() => onEditBook(value.id)}
                  >
                    <Text>Edit</Text>
                  </Pressable>
                  <Pressable
                    disabled={loading}
                    onPress={() => onBinBook(value.id)}
                  >
                    <Text>Bin</Text>
                  </Pressable>
                </View>
              </View>
            );
          }
        })}
        <Text style={styles.heading}>Bin</Text>
        {booklist.books.map((value, index) => {
          if (value.section === "Bin") {
            return (
              <View key={index} style={styles.bookContainer}>
                <Text key={"title" + index}>{value.title}</Text>
                <Text key={"author" + index}>{value.author}</Text>
                <View style={styles.bookBtnsContainer}>
                  <Pressable
                    disabled={loading}
                    onPress={() => onPermDelete(value.id)}
                  >
                    <Text>Delete Permanently</Text>
                  </Pressable>
                  <Pressable
                    disabled={loading}
                    onPress={() => onRestore(value.id)}
                  >
                    <Text>Restore</Text>
                  </Pressable>
                </View>
              </View>
            );
          }
        })}
      </ScrollView>
      <PrimaryBtn onPress={onAddBook} disabled={loading}>
        Add Book
      </PrimaryBtn>
    </SafeAreaView>
  );
}
