import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomepageScreen from "../components/HomePages/HomepageScreen";
import "../db/global";
import "../attribute/global";
import * as firebase from "firebase";
import "firebase/firestore";
import ContactUsScreen from "../components/HomePages/ContactUsScreen";
import EditProfileScreen from "../components/HomePages/EditProfileScreen";
import AccountSettingsScreen from "../components/HomePages/AccountSettingsScreen";
import SendMessageScreen from "../components/HomePages/SendMessageScreen";
import ViewParticipant from "../components/HomePages/ViewParticipant";
import FastMessageScreen from "../components/HomePages/FastMessageScreen";
import ViewProfileScreen from "../components/HomePages/ViewProfileScreen";
import AddParticipantScreen from "../components/HomePages/AddParticantScreen";
import CustomNavigation from "./CustomNavigation";
import SearchGroupScreen from "../components/HomePages/SearchGroupScreen";
import { color } from "react-native-reanimated";
import NewMessageScreen from "../components/HomePages/NewMessageScreen";
import LanguageScreen from "../components/HomePages/LanguageScreen";
import UpgradeToPro from "../components/HomePages/UpgradeToPro";
import QRCodeScanner from "../components/HomePages/QRCodeScanner";
import CardField from "../components/HomePages/CardField";
import QRImage from "../components/HomePages/QRImage";
import { english } from "../HelperClass/Language";
import { italian } from "../HelperClass/Language";
import { french } from "../HelperClass/Language";
import { dutch } from "../HelperClass/Language";
import { deutsch } from "../HelperClass/Language";

const HomepageNavigation = () => {
  const Drawer = createDrawerNavigator();
  const currentUser = firebase.auth().currentUser;
  const getCurrentLanguage = async () => {
    try {
      const contactExist = await firebase
        .database()
        .ref("users/" + currentUser.uid)
        .orderByChild("chatUID");
      contactExist.once("value").then((snapshot) => {
        if (snapshot.exists()) {
          if (snapshot.val().language === "English") {
            english();
          } else if (snapshot.val().language === "German") {
            deutsch();
          } else if (snapshot.val().language === "Dutch") {
            dutch();
          } else if (snapshot.val().language === "Italian") {
            italian();
          } else if (snapshot.val().language === "French") {
            french();
          }
        }
      });
    } catch (err) {
      Alert.alert(global.alertErrorTitle, `${global.alertCatch}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    }
  };
  getCurrentLanguage();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomNavigation {...props} />}
      initialRouteName="HomepageScreen"
      screenOptions={{
        headerTitleStyle: { fontSize: 15, fontWeight: "bold" },
        headerTintColor: "#fff",
        headerStyle: {
          elevation: 0,
          backgroundColor: "#38B3FE",
        },
      }}
    >
      <Drawer.Screen
        name="HomepageScreen"
        component={HomepageScreen}
        options={{
          headerShown: false,
          title: "",
          icon: ({ focused }) => (
            <Icon
              name="message"
              size={25}
              color={focused ? "#2F7FEB" : "#9E9E9E"}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          title: global.editProfile,
          drawerIcon: ({ focused }) => (
            <Icon
              name="person"
              size={25}
              color={focused ? "#2F7FEB" : "#9E9E9E"}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="AccountSettingsScreen"
        component={AccountSettingsScreen}
        options={{
          title: global.accountSettings,
          drawerIcon: ({ focused }) => (
            <Icon
              name="settings"
              size={25}
              color={focused ? "#2F7FEB" : "#9E9E9E"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{
          title: global.language,
          drawerIcon: ({ focused }) => (
            <Icon
              name="language"
              size={25}
              color={focused ? "#2F7FEB" : "#9E9E9E"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ContactUsScreen"
        component={ContactUsScreen}
        options={{
          title: global.contactUs,
          drawerIcon: ({ focused }) => (
            <Icon
              name="credit-card"
              size={25}
              color={focused ? "#2F7FEB" : "#9E9E9E"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="SendMessageScreen"
        component={SendMessageScreen}
        options={{
          headerShown: false,
          swipeEnabled: false,
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="ViewParticipant"
        component={ViewParticipant}
        options={{
          headerShown: false,
          swipeEnabled: false,
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="FastMessageScreen"
        component={FastMessageScreen}
        options={{
          headerShown: false,
          swipeEnabled: false,
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="ViewProfileScreen"
        component={ViewProfileScreen}
        options={{
          headerShown: false,
          swipeEnabled: false,
          title: "Profile",
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="AddParticipantScreen"
        component={AddParticipantScreen}
        options={{
          headerShown: false,
          swipeEnabled: false,
          title: "Profile",
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="SearchGroupScreen"
        component={SearchGroupScreen}
        options={{
          headerShown: false,
          swipeEnabled: false,
          title: "Search Group",
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="NewMessageScreen"
        component={NewMessageScreen}
        options={{
          headerShown: false,
          swipeEnabled: false,
          title: "Message",
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="UpgradeToPro"
        component={UpgradeToPro}
        options={{
          title: global.upgradeToPro,
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="QRCodeScanner"
        component={QRCodeScanner}
        options={{
          headerShown: false,
          swipeEnabled: false,
          title: "Scan QRCode",
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="CardField"
        component={CardField}
        options={{
          title: "Scan QRCode",
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="QRImage"
        component={QRImage}
        options={{
          title: "",
          drawerItemStyle: { height: 0 },
        }}
      />
    </Drawer.Navigator>
  );
};

export default HomepageNavigation;