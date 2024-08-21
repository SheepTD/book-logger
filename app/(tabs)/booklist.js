import { Text, StyleSheet, Pressable } from "react-native";
import ColorPalette from "../../constants/ColorPalette";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../../utils/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryBtn from "../../components/PrimaryBtn";
import Size from "../../constants/Size";

export default function Booklist() {
  const isInitialRender = useRef(true);
  const [booklist, setBooklist] = useState({
    books: [],
    changelog: [],
    latestBookId: 0,
  });
  const [selectedBookId, setSelectedBookId] = useState("initial value");
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
  });

  // fetch data on initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const savedBooklist = await AsyncStorage.getItem("booklist"); // remove this
        console.log("saved booklist:", savedBooklist);
        const parsedBooklist = JSON.parse(savedBooklist);
        setBooklist(parsedBooklist);
      } catch (e) {
        console.log("error fetching booklist data", e); // change this
      }
    };
    fetchInitialData();
  }, []);

  // save selected book id on update and forward to edit book page
  useEffect(() => {
    const setSelectedBookId = async () => {
      try {
        const stringSelectedBookId = JSON.stringify(selectedBookId);
        await AsyncStorage.setItem("", stringSelectedBookId);
        console.log("Saved selected book id:", stringSelectedBookId);
        router.replace("edit-book");
      } catch (e) {
        console.log("error saving edit book id:", e); // change this
      }
    };
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      setSelectedBookId();
    }
  }, [selectedBookId]);

  // log booklist on update - remove this
  useEffect(() => {
    console.log("booklist:", booklist);
  }, [booklist]);

  // add book function
  const onAddBook = async () => {
    console.log("Add book pressed"); // remove this
    setLoading(true);
    setSelectedBookId(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <PrimaryBtn onPress={onAddBook} disabled={loading}>
        Add Book
      </PrimaryBtn>
    </SafeAreaView>
  );
}

// // get or set data from local storage
// const getData = async (key, expectedValue) => {
//   try {
//     // Try to get the item from AsyncStorage
//     const jsonValue = await AsyncStorage.getItem(key);
//     console.log("data from async storage:", jsonValue);
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

// export default function Booklist() {
//   const [booklist, setBooklist] = useState({
//     books: [],
//     changelog: [],
//     latestBookId: 0,
//   });
//   const [selectedBookId, setSelectedBookId] = useState("initial value");
//   // tells the selectedBookId useEffect that it is being triggered for the first time
//   const [initialLoad, setInitialLoad] = useState(true);
//   // add book loading state
//   const [loading, setLoading] = useState(false);

//   // styles
//   const size = Size();
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: "left",
//       alignItems: "left",
//       backgroundColor: ColorPalette.bg,
//     },
//     text: {
//       fontSize: size.text,
//       color: ColorPalette.text,
//     },
//   });

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
//     };
//     fetchSetData();

//     // ensure that the user is logged in
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (!session) {
//         router.replace("/(auth)/access");
//       }
//     });
//   }, []);

//   // update async storage on selectedBookId change
//   useEffect(() => {
//     const setSelectedBookIdAsync = async () => {
//       // wait for data to be set to asyncstorage
//       await setData("selected-book", selectedBookId, true);
//       console.log("selectedBookId has been set:", selectedBookId); // change this

//       console.log(initialLoad);

//       if (initialLoad === false) {
//         console.log("This is the inital load"); // remove this

//         // send user to the edit book page
//         router.replace("edit-book");
//       }
//       // update state
//       setInitialLoad(false);
//     };
//     setSelectedBookIdAsync();
//   }, [selectedBookId]);

//   const onAddBook = () => {
//     setLoading(true);
//     setSelectedBookId("");
//     console.log("add book pressed");
//   };

//   // const deleteEverything = async () => {
//   //   let keys = [];
//   //   try {
//   //     keys = await AsyncStorage.getAllKeys();
//   //   } catch (e) {
//   //     // read key error
//   //   }

//   //   console.log(keys);
//   //   // example console.log result:
//   //   // ['@MyApp_user', '@MyApp_key']

//   //   try {
//   //     await AsyncStorage.multiRemove(keys);
//   //   } catch (e) {
//   //     // remove error
//   //   }

//   //   console.log("Everything Deleted!");
//   // };
//   // deleteEverything();

//   return (
//     <SafeAreaView style={styles.container}>
//       {booklist.books.forEach((el) => {
//         return (
//           <Text style={styles.text} key={el.id}>
//             el.title
//           </Text>
//         );
//       })}
//       <PrimaryBtn onPress={onAddBook} disabled={loading}>
//         Add Book
//       </PrimaryBtn>
//     </SafeAreaView>
//   );
// }
