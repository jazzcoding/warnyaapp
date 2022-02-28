import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import ProfilePhoToScreen from "../components/SignUpPages/ProfilePhotoScreen";
import LanguageScreen from "../components/SignUpPages/LanguageScreen";
import NameScreen from "../components/SignUpPages/NameScreen";
const Stack = createStackNavigator();

const SignedUpNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { elevation: 0, backgroundColor: "#38B3FE" },
        title: "",
      }}
    >
      <Stack.Screen name="NameScreen" component={NameScreen} />
      <Stack.Screen
        name="ProfilePhotoScreen"
        component={ProfilePhoToScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{
          title: "Change Language",
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
};

export default SignedUpNavigation;
