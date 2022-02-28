import React from "react";
import { Button, Card, CheckBox, Icon, Overlay } from "react-native-elements";
import { View, Text, Dimensions, StyleSheet, Alert } from "react-native";
import "../../attribute/global";
import * as firebase from "firebase";
import "firebase/firestore";
import LoadingPage from "../../attribute/LoadingPage";
import { useIsFocused } from "@react-navigation/core";
import { AuthContext } from "../../attribute/context";
const LanguageScreen = ({ navigation }) => {
  const { userChangeLanguage } = React.useContext(AuthContext);
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  const [isLoading, setIsLoading] = React.useState(true);
  const currentUser = firebase.auth().currentUser;
  const [visible, setVisible] = React.useState(false);
  const [language, setLanguage] = React.useState("");
  const isFocused = useIsFocused();
  const [isEnglishLanguageChecked, setIsEnglishLanguageChecked] =
    React.useState(false);
  const [isDeutschLanguageChecked, setIsDeutschLanguageChecked] =
    React.useState(false);
  const [isDutchLanguageChecked, setIsDutchLanguageChecked] =
    React.useState(false);
  const [isFrenchLanguageChecked, setIsFrenchLanguageChecked] =
    React.useState(false);
  const [isItalianLanguageChecked, setIsItalianLanguageChecked] =
    React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      getUserSettings();
    }, 1000);
  }, [isFocused]);

  const getUserSettings = async () => {
    try {
      const contactExist = await firebase
        .database()
        .ref("users/" + currentUser.uid)
        .orderByChild("chatUID");
      contactExist.once("value").then((snapshot) => {
        if (snapshot.exists()) {
          setLanguage(snapshot.val().language);
          if (snapshot.val().language === "English") {
          } else if (snapshot.val().language === "German") {
          } else if (snapshot.val().language === "Dutch") {
          } else if (snapshot.val().language === "Italian") {
          } else if (snapshot.val().language === "French") {
          }
          setIsLoading(false);
        } else {
          console.log("File does not exist");
          setIsLoading(false);
        }
      });
    } catch (err) {
      Alert.alert(global.alertErrorTitle, `${global.alertCatch}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    }
  };

  if (isLoading === true) {
    return <LoadingPage />;
  }
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.TextStyle,
          {
            fontSize: global.fontTitleSize,
            color: global.textBlueColor,
            fontWeight: "bold",
          },
        ]}
      >
        {global.language}
      </Text>

      <Button
        title={language}
        type="solid"
        buttonStyle={[
          styles.ButtonStyle,
          { backgroundColor: "#38B3FE", width: "50%" },
        ]}
        onPress={() => {}}
      />
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-evenly",
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          padding: 20,
        }}
      >
        <Button
          title={global.textChooseLanguage}
          type="solid"
          titleStyle={{ fontSize: 12 }}
          buttonStyle={[styles.ButtonStyle, { width: "100%" }]}
          onPress={() => {
            userChangeLanguage();
          }}
        />
        <Button
          title={global.textBack}
          type="solid"
          titleStyle={{ fontSize: 12, color: "#2F7FEB" }}
          buttonStyle={[
            styles.ButtonStyle,
            { backgroundColor: "#fff", width: "100%" },
          ]}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: global.backgroundWhiteColor,
    flex: 1,
    height: "100%",
  },

  ButtonStyle: {
    borderWidth: 1,
    borderColor: "#707070",
    color: "#fff",
    borderRadius: 100,
    alignSelf: "center",
    margin: 10,
    padding: 15,
  },
  FormContainer: {
    margin: 0,
    borderWidth: 0,
    elevation: 0,
  },
  TextStyle: {
    marginTop: 50,
    padding: 10,
    width: "100%",
    textAlign: "center",
  },
  CheckboxStyle: {
    backgroundColor: backgroundBlueColor,
    borderRadius: 100,
  },
});

export default LanguageScreen;
