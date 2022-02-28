import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../components/WelcomeScreen";
import SignupScreen from "../components/SignUpPages/SignupScreen";
import LoginScreen from "../components/LoginPages/LoginScreen";
import LoadingPage from "../attribute/LoadingPage";
import ResetPasswordScreen from "../components/LoginPages/ResetPasswordScreen";
import FastMessageScreen from "../components/HomePages/FastMessageScreen";
const Stack = createStackNavigator();
const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "#fff",
        headerStyle: { elevation: 0, backgroundColor: "#38B6FF" },
        title: "",
      }}
    >
      <Stack.Screen
        name="WelcomeScreen"
        component={Welcome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
