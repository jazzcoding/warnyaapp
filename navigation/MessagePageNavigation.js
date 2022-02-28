import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import SendMessageScreen from "../components/HomePages/SendMessageScreen";
import ViewParticipant from "../components/HomePages/ViewParticipant";

const Stack = createStackNavigator();

const MessagePageNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { elevation: 0, backgroundColor: "#38B3FE" },
        title: "",
      }}
    >
      <Stack.Screen
        name="SendMessageScreen"
        component={SendMessageScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MessagePageNavigation;
