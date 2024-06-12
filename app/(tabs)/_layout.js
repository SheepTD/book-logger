import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="friends" />
      <Tabs.Screen name="booklist" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
