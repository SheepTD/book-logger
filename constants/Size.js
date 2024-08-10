// TO DO: allow sizes to adjust more on the web

import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Size = {
  marginClose: 10,
  marginFar: 20,
  marginLeft: 0.05 * width,
  standardHeight: 0.08 * height,
  width: 0.9 * width,
  text: 16,
  header: 24,
};

export default Size;
