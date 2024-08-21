// TODO:
// Genre related functionality: retrive genres from save, add and save new genre
// Add validitiy checks and warning to all inputs
// Update layout to match the design

import { Text, StyleSheet, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ColorPalette from "../constants/ColorPalette";
import Size from "../constants/Size";
import { useEffect, useState } from "react";
import PrimaryBtn from "../components/PrimaryBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../utils/supabase";
import { router } from "expo-router";

export default function EditBook() {}

// // get or set data from local storage
// const getData = async (key, expectedValue) => {
//   try {
//     // Try to get the item from AsyncStorage
//     const jsonValue = await AsyncStorage.getItem(key);

//     // If the item exists, parse and return it
//     if (jsonValue !== null) {
//       return JSON.parse(jsonValue);
//     } else {
//       // If the item does not exist, set it with the expectedValue
//       const newJsonValue = JSON.stringify(expectedValue);
//       await AsyncStorage.setItem(key, newJsonValue);

//       return expectedValue;
//     }
//   } catch (e) {
//     console.error("Error accessing or setting data in AsyncStorage:", e); // change this
//     return null; // Or handle the error according to your needs
//   }
// };

// const setData = async (key, value, isString) => {
//   if (isString) {
//     try {
//       await AsyncStorage.setItem(key, value);
//     } catch (e) {
//       console.log("Error setting data in AsyncStorage:", e); // change this
//     }
//   } else {
//     try {
//       const jsonValue = JSON.stringify(value);
//       await AsyncStorage.setItem(key, jsonValue);
//     } catch (e) {
//       console.log("Error setting data in AsyncStorage:", e); // change this
//     }
//   }
// };

// export default function EditBook() {
//   // async storage state
//   const [genres, setGenres] = useState([
//     "Adventure",
//     "Dystopian",
//     "Fantasy",
//     "Health",
//     "Historical Fiction",
//     "Horror",
//     "Mystery",
//     "Non-Fiction",
//     "Philosophy",
//     "Poetry",
//     "Romance",
//     "Science",
//     "Science Fiction",
//     "Self-Help",
//     "Thriller",
//     "Travel",
//     "True Crime",
//   ]);
//   const [booklist, setBooklist] = useState({
//     books: [],
//     changelog: [],
//     latestBookId: 0,
//   });
//   const [editBookId, setEditBookId] = useState("initial value");
//   // input state
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [finishDate, setFinishDate] = useState("");
//   const [genre, setGenre] = useState("");
//   const [rating, setRating] = useState();
//   const [review, setReview] = useState("");
//   // loading state
//   const [loading, setLoading] = useState(false);

//   // Fetch and set data on component mount
//   useEffect(() => {
//     const fetchSetData = async () => {
//       const data = await getData("booklist", {
//         books: [],
//         changelog: [],
//         latestBookId: 0,
//       });
//       setBooklist(data);
//       console.log("Booklist data has been fetched/set:", booklist); // change this
//       const id = await getData("selected-book", "");
//       setEditBookId(id);
//     };
//     fetchSetData();

//     // ensure that the user is logged in
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (!session) {
//         router.replace("/(auth)/access");
//       }
//     });
//   }, []);

//   const onSaveBook = async () => {
//     setLoading(true);
//     // check that all of the inputs are valid
//     const newBooklist = booklist;
//     newBooklist.books.push({
//       id: editBookId === "" ? booklist.latestBookId + 1 : editBookId,
//       section: "reading", // add logic for this
//       title: title,
//       author: author,
//       startDate: startDate,
//       finishDate: finishDate,
//       genre: genre,
//       rating: rating,
//       review: review,
//     });
//     setBooklist(newBooklist);
//     console.log("booklist set:", booklist);
//     // save updated booklist to async storage
//     const saveBook = async () => {
//       await setData("booklist", booklist, false);
//       console.log("booklist saved to local storage:", booklist);
//       router.replace("booklist");
//     };
//     saveBook();
//   };

//   // styles
//   const size = Size();
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: "left",
//       alignItems: "left",
//       backgroundColor: ColorPalette.bg,
//     },
//     header: {
//       flex: 1,
//       maxHeight: size.headerHeight,
//       width: "100%",
//       backgroundColor: ColorPalette.tabBar,
//       marginBottom: size.marginClose,
//     },
//     input: {
//       height: size.thinHeight,
//       marginLeft: size.marginLeft,
//       marginBottom: size.marginClose,
//       padding: size.padding,
//       width: size.standardWidth,
//       backgroundColor: ColorPalette.secondary,
//       fontSize: size.text,
//     },
//     label: {
//       fontSize: size.text,
//       marginLeft: size.marginLeft,
//     },
//     datesContainer: {
//       flex: 1,
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginLeft: size.marginLeft,
//       marginBottom: size.marginClose,
//       width: size.standardWidth,
//       maxHeight: size.thinHeight,
//     },
//     dateInput: {
//       height: size.thinHeight,
//       padding: size.padding,
//       width: 0.475 * size.standardWidth,
//       backgroundColor: ColorPalette.secondary,
//       fontSize: size.text,
//     },
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text>Header</Text>
//       </View>
//       <Text style={styles.label}>Title</Text>
//       <TextInput
//         style={styles.input}
//         cursorColor={ColorPalette.cursor}
//         placeholder="Enter title"
//         onChangeText={(text) => setTitle(text)}
//         value={title}
//         autoCapitalize="words"
//       />
//       <Text style={styles.label}>Author</Text>
//       <TextInput
//         style={styles.input}
//         cursorColor={ColorPalette.cursor}
//         placeholder="Enter author"
//         onChangeText={(text) => setAuthor(text)}
//         value={author}
//         autoCapitalize="words"
//       />
//       <Text style={styles.label}>Dates</Text>
//       <View style={styles.datesContainer}>
//         <TextInput
//           style={styles.dateInput}
//           cursorColor={ColorPalette.cursor}
//           placeholder="Enter start date"
//           onChangeText={(text) => setStartDate(text)}
//           value={startDate}
//           autoCapitalize="none"
//         />
//         <TextInput
//           style={styles.dateInput}
//           cursorColor={ColorPalette.cursor}
//           placeholder="Enter finish date"
//           onChangeText={(text) => setFinishDate(text)}
//           value={finishDate}
//           autoCapitalize="none"
//         />
//       </View>

//       <Text style={styles.label}>Genre</Text>
//       <TextInput
//         style={styles.input}
//         cursorColor={ColorPalette.cursor}
//         placeholder="Enter genre"
//         onChangeText={(text) => setGenre(text)}
//         value={genre}
//         autoCapitalize="words"
//       />

//       <Text style={styles.label}>Rating</Text>
//       <TextInput
//         style={styles.input}
//         cursorColor={ColorPalette.cursor}
//         placeholder="Enter rating from 1 to 10"
//         onChangeText={(text) => setRating(text)}
//         value={rating}
//         autoCapitalize="words"
//       />

//       <Text style={styles.label}>Review</Text>
//       <TextInput
//         style={styles.input}
//         cursorColor={ColorPalette.cursor}
//         placeholder="Write review here"
//         onChangeText={(text) => setReview(text)}
//         value={review}
//         autoCapitalize="sentences"
//       />
//       <PrimaryBtn onPress={onSaveBook} disabled={loading}>
//         Save Book
//       </PrimaryBtn>
//     </SafeAreaView>
//   );
// }
