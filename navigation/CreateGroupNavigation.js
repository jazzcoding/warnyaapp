import React from "react";
import "../attribute/global";
import { createStackNavigator } from "@react-navigation/stack";
import ChooseParticipant from "../components/HomePages/ChooseParticipant";
import CreateGroupScreen from "../components/HomePages/CreateGroupScreen";
import GroupSettingsCreen from "../components/HomePages/GroupSettingsCreen";

const Stack = createStackNavigator();

const CreateGroupNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "#fff",
        headerTitleStyle: { fontSize: 15, fontWeight: "bold" },
        headerStyle: { elevation: 0, backgroundColor: "#38B3FE" },
        title: "",
      }}
    >
      <Stack.Screen
        name="CreateGroupScreen"
        component={CreateGroupScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="GroupSettingsCreen"
        component={GroupSettingsCreen}
        options={{
          title: global.textGroupSettings,
        }}
      />
      <Stack.Screen
        name="ChooseParticipant"
        component={ChooseParticipant}
        options={{
          title: global.textChooseParticipants,
        }}
      />
    </Stack.Navigator>
  );
};

export default CreateGroupNavigation;
