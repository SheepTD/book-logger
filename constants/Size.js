// TO DO: allow sizes to adjust more on the web

import { Dimensions } from "react-native"; // does not resize
import { useWindowDimensions } from "react-native"; // does resize
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Size() {
  const staticWidth = Dimensions.get("window").width;
  const staticHeight = Dimensions.get("window").height;

  const { height, width } = useWindowDimensions();

  const { top } = useSafeAreaInsets();

  return {
    safeTopInset: top,
    marginClose: 10,
    marginFar: 20,
    marginLeft: 0.05 * width,
    tabBarHeight: 0.08 * staticHeight,
    headerHeight: 0.08 * staticHeight,
    standardHeight: 0.08 * staticHeight,
    thinHeight: 0.06 * staticHeight,
    standardWidth: 0.9 * width,
    text: 16,
    header: 24,
    padding: 10,
    headingText: 24,
  };
}
