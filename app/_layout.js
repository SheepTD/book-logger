import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="index"
        options={{
          title: "Intial Setup Page",
        }}
      />
    </Stack>
  );
}
