import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "./attribute/context";
import * as firebase from "firebase";
import TextNavigation from "./navigation/CreateGroupNavigation";
import HomepageNavigation from "./navigation/HomepageNavigation";
import SignedUpNavigation from "./navigation/SignedUpNavigation";
import Navigation from "./navigation/Navigation";
import MessagePageNavigation from "./navigation/MessagePageNavigation";
import CreateGroupNavigation from "./navigation/CreateGroupNavigation";
import LoadingPage from "./attribute/LoadingPage";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const responseListener = React.useRef();
  const notificationListener = React.useRef();
  const [notification, setNotification] = React.useState(false);
  const firebaseConfig = {
    apiKey: "AIzaSyDFWZEzofY-Pay1QK40XLB8mWVITPhHBro",
    authDomain: "warn-ya.firebaseapp.com",
    databaseURL:
      "https://warn-ya-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "warn-ya",
    storageBucket: "warn-ya.appspot.com",
    messagingSenderId: "511690273632",
    appId: "1:511690273632:web:44aa7d1f35864baf0fa405",
    measurementId: "G-SR7DF5EZB7",
  };
  React.useEffect(() => {
    !firebase.apps.length
      ? firebase.initializeApp(firebaseConfig).firestore()
      : firebase.app().firestore();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    setTimeout(async () => {
      const currentUser = await firebase.auth().currentUser;
      if (currentUser !== null) {
        setUserState("SignedIn");
      } else {
        setUserState("Login");
      }
    }, 5000);
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  //initialize firebase
  const [userState, setUserState] = React.useState(null);
  const authContext = React.useMemo(() => ({
    userSignedUp: () => {
      setUserState("SingedUp");
    },
    userSignedIn: () => {
      setUserState("SignedIn");
    },
    userCreateGroup: () => {
      setUserState("CreateGroup");
    },
    userMassage: () => {
      setUserState("Message");
    },
    userLogin: () => {
      setUserState("Login");
    },
  }));
  if (userState === "SignedIn") {
    return (
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <HomepageNavigation />
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
  if (userState === "CreateGroup") {
    return (
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <CreateGroupNavigation />
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
  if (userState === "Message") {
    return (
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <MessagePageNavigation />
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
  if (userState === "SingedUp") {
    return (
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <SignedUpNavigation />
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
  if (userState === "Login") {
    return (
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <LoadingPage />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
