import { Text, StyleSheet, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ColorPalette from "../constants/ColorPalette";
import Size from "../constants/Size";
import { useState } from "react";

export default function EditBook() {
  // async storage state
  const [genres, setGenres] = useState([
    "Adventure",
    "Dystopian",
    "Fantasy",
    "Health",
    "Historical Fiction",
    "Horror",
    "Mystery",
    "Non-Fiction",
    "Philosophy",
    "Poetry",
    "Romance",
    "Science",
    "Science Fiction",
    "Self-Help",
    "Thriller",
    "Travel",
    "True Crime",
  ]);
  const [booklist, setBooklist] = useState({
    books: [],
    changelog: [],
    latestBookId: 0,
  });
  const [editBookId, setEditBookId] = useState("initial value");
  const [initialLoad, setInitialLoad] = useState(true);
  // input state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState();
  const [review, setReview] = useState("");
  // loading state
  const [loading, setLoading] = useState("");
  // styles
  const size = Size();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "left",
      alignItems: "left",
      backgroundColor: ColorPalette.bg,
    },
    header: {
      flex: 1,
      maxHeight: size.headerHeight,
      width: "100%",
      backgroundColor: ColorPalette.tabBar,
      marginBottom: size.marginClose,
    },
    input: {
      height: size.thinHeight,
      marginLeft: size.marginLeft,
      marginBottom: size.marginClose,
      padding: 10,
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
      padding: 10,
      width: 0.475 * size.standardWidth,
      backgroundColor: ColorPalette.secondary,
      fontSize: size.text,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text>Header</Text>
      </View>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Enter title"
        onChangeText={(text) => setTitle(text)}
        value={title}
        autoCapitalize="words"
      />
      <Text style={styles.label}>Author</Text>
      <TextInput
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
          style={styles.dateInput}
          cursorColor={ColorPalette.cursor}
          placeholder="Enter start date"
          onChangeText={(text) => setStartDate(text)}
          value={startDate}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.dateInput}
          cursorColor={ColorPalette.cursor}
          placeholder="Enter finish date"
          onChangeText={(text) => setFinishDate(text)}
          value={finishDate}
          autoCapitalize="none"
        />
      </View>
      <Text style={styles.label}>Review</Text>
      <TextInput
        style={styles.input}
        cursorColor={ColorPalette.cursor}
        placeholder="Write review here"
        onChangeText={(text) => setAuthor(text)}
        value={author}
        autoCapitalize="words"
      />
    </SafeAreaView>
  );
}
