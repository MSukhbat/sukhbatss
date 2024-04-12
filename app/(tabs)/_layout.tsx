import React from "react";

import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Downloader",

          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable></Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Player",
        }}
      />
    </Tabs>
  );
}
