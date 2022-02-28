import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import ChangeLanguageScreen from "../components/HomePages/ChangeLaguageScreen";

const Stack = createStackNavigator();

const LanguageNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { elevation: 0, backgroundColor: "#38B3FE" },
        title: "",
      }}
    >
      <Stack.Screen
        name="ChangeLaguageScreen"
        component={ChangeLanguageScreen}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default LanguageNavigation;
