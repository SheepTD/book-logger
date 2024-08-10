import { Text, StyleSheet } from "react-native";
import ColorPalette from "../../constants/ColorPalette";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../../utils/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryBtn from "../../components/PrimaryBtn";
import Size from "../../constants/Size";

// get or set data from local storage
const getData = async (key, expectedValue) => {
  try {
    // Try to get the item from AsyncStorage
    const jsonValue = await AsyncStorage.getItem(key);

    // If the item exists, parse and return it
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    } else {
      // If the item does not exist, set it with the expectedValue
      const newJsonValue = JSON.stringify(expectedValue);
      await AsyncStorage.setItem(key, newJsonValue);

      return expectedValue;
    }
  } catch (e) {
    console.error("Error accessing or setting data in AsyncStorage:", e); // change this
    return null; // Or handle the error according to your needs
  }
};

const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log("Error setting data in AsyncStorage:", e); // change this
  }
};

export default function Booklist() {
  const [booklist, setBooklist] = useState({
    books: [],
    changelog: [],
    latestBookId: 0,
  });
  const [editBookId, setEditBookId] = useState();
  // tells the editBookId useEffect that it is being triggered for the first time
  const [initialLoad, setInitialLoad] = useState(true);
  // add book loading state
  const [loading, setLoading] = useState(false);

  // Fetch and set data on component mount
  useEffect(() => {
    const fetchSetData = async () => {
      const data = await getData("booklist", {
        books: [],
        changelog: [],
        latestBookId: 0,
      });
      setBooklist(data);
      console.log("Booklist data has been fetched/set:", booklist); // change this
    };
    fetchSetData();

    // ensure that the user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/(auth)/access");
      }
    });
  }, []);

  // update async storage on editBookId change
  useEffect(() => {
    const setEditBookIdAsync = async () => {
      // wait for data to be set to asyncstorage
      await setData("selected-book", editBookId);
      console.log("editBookId has been set:", editBookId); // change this

      console.log(initialLoad);

      if (initialLoad === false) {
        console.log("This is the inital load"); // remove this

        // send user to the edit book page
        router.replace("edit-book");
      }
      // update state
      setInitialLoad(false);
    };
    setEditBookIdAsync();
  }, [editBookId]);

  const onAddBook = () => {
    setLoading(true);
    setEditBookId("");
    console.log("add book pressed");
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {booklist.books.forEach((el) => {
        return (
          <Text style={styles.text} key={el.id}>
            el.title
          </Text>
        );
      })}
      <PrimaryBtn onPress={onAddBook} disabled={loading}>
        Add Book
      </PrimaryBtn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "left",
    backgroundColor: ColorPalette.bg,
  },
  text: {
    fontSize: Size.text,
    color: ColorPalette.text,
  },
});
