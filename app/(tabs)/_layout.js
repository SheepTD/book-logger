import { Tabs } from "expo-router";
import Size from "../../constants/Size";
import ColorPalette from "../../constants/ColorPalette";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Size.inputHeight,
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: ColorPalette.tabBar,
        },
        tabBarActiveBackgroundColor: ColorPalette.tabBarActive,
        tabBarLabelStyle: {
          marginBottom: 6,
          color: ColorPalette.text,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: (color) => (
            <FontAwesome5 size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: (color) => (
            <FontAwesome5 size={28} name="user-friends" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="booklist"
        options={{
          title: "BookList",
          tabBarIcon: (color) => (
            <FontAwesome5 size={28} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
          tabBarIcon: (color) => (
            <FontAwesome5 size={28} name="chart-bar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: (color) => (
            <FontAwesome5 size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
