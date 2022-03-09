import React from "react";
import { Button, Card, CheckBox, Icon, Overlay } from "react-native-elements";
import { View, Text, Dimensions, StyleSheet, Alert } from "react-native";
import "../../attribute/global";
import * as firebase from "firebase";
import "firebase/firestore";
import { Restart } from "fiction-expo-restart";
import { english } from "../../HelperClass/Language";
import { italian } from "../../HelperClass/Language";
import { french } from "../../HelperClass/Language";
import { dutch } from "../../HelperClass/Language";
import { deutsch } from "../../HelperClass/Language";
import LoadingPage from "../../attribute/LoadingPage";
import { useIsFocused } from "@react-navigation/core";
import { AdMobInterstitial } from "expo-ads-admob";
import moment from "moment";
import "moment/locale/it";
import "moment/locale/de";
import "moment/locale/nl";
import "moment/locale/en-ca";
import "moment/locale/fr";
import { AuthContext } from "../../attribute/context";
const ChangeLanguageScreen = ({ navigation }) => {
  const { userSignedIn } = React.useContext(AuthContext);
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
            moment.locale("en-ca");
            englishSelected();
          } else if (snapshot.val().language === "German") {
            moment.locale("de");
            deutschSelected();
          } else if (snapshot.val().language === "Dutch") {
            moment.locale("dutch");
            dutchSelected();
          } else if (snapshot.val().language === "Italian") {
            moment.locale("it");
            italianSelected();
          } else if (snapshot.val().language === "French") {
            moment.locale("fr");
            frenchSelected();
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
  const showAds = async () => {
    var now = moment().format("MM/DD/YYYY HH:mm");
    if (moment(global.subscription).isSameOrAfter(moment(now))) {
      return null;
    } else {
      if (Platform.OS === "ios") {
        await AdMobInterstitial.setAdUnitID(
          "ca-app-pub-5356140400244515/9096764428"
        );
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: false });
        await AdMobInterstitial.showAdAsync();
      } else {
        await AdMobInterstitial.setAdUnitID(
          "ca-app-pub-5356140400244515/7790169571"
        );
        await AdMobInterstitial.requestAdAsync({
          servePersonalizedAds: false,
        });
        await AdMobInterstitial.showAdAsync();
      }
    }
  };

  const registerMyLanguage = async () => {
    const currentUser = firebase.auth().currentUser;
    try {
      firebase
        .database()
        .ref("users/" + currentUser.uid)
        .update({ language });
      Alert.alert(global.alertSuccessTitle, global.textLanguageSuccess, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
      showAds();
    } catch (err) {
      Alert.alert(global.alertErrorTitle, global.alertCatch, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    }
  };
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const englishSelected = () => {
    setIsEnglishLanguageChecked(true);
    setIsFrenchLanguageChecked(false);
    setIsDutchLanguageChecked(false);
    setIsDeutschLanguageChecked(false);
    setIsItalianLanguageChecked(false);
    english();
    setLanguage("English");
  };
  const italianSelected = () => {
    setIsEnglishLanguageChecked(false);
    setIsFrenchLanguageChecked(false);
    setIsDutchLanguageChecked(false);
    setIsItalianLanguageChecked(true);
    setIsDeutschLanguageChecked(false);
    italian();
    setLanguage("Italian");
  };
  const frenchSelected = () => {
    setIsEnglishLanguageChecked(false);
    setIsFrenchLanguageChecked(true);
    setIsDutchLanguageChecked(false);
    setIsDeutschLanguageChecked(false);
    setIsItalianLanguageChecked(false);
    french();
    setLanguage("French");
  };
  const deutschSelected = () => {
    setIsEnglishLanguageChecked(false);
    setIsFrenchLanguageChecked(false);
    setIsDutchLanguageChecked(false);
    setIsItalianLanguageChecked(false);
    setIsDeutschLanguageChecked(true);
    deutsch();
    setLanguage("German");
  };
  const dutchSelected = () => {
    setIsEnglishLanguageChecked(false);
    setIsFrenchLanguageChecked(false);
    setIsItalianLanguageChecked(false);
    setIsDutchLanguageChecked(true);
    setIsDeutschLanguageChecked(false);
    dutch();
    setLanguage("Dutch");
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
        iconRight
        icon={
          <Icon
            name="downcircle"
            type="antdesign"
            size={15}
            color="white"
            containerStyle={{ marginLeft: 20 }}
          />
        }
        title={language}
        type="solid"
        iconPosition="right"
        buttonStyle={[
          styles.ButtonStyle,
          { backgroundColor: "#38B3FE", width: "50%" },
        ]}
        onPress={() => toggleOverlay()}
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
          title={global.buttonContiue}
          type="solid"
          titleStyle={{ fontSize: 12 }}
          buttonStyle={[styles.ButtonStyle, { width: "100%" }]}
          onPress={() => registerMyLanguage()}
        />
        <Button
          title={global.textBack}
          type="solid"
          titleStyle={{ fontSize: 12, color: "#2F7FEB" }}
          buttonStyle={[
            styles.ButtonStyle,
            { backgroundColor: "#fff", width: "100%" },
          ]}
          onPress={() => {
            userSignedIn();
          }}
        />
      </View>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{ width: windowWidth - 50 }}
      >
        <Text
          style={{
            fontSize: global.fontTitleSize,
            color: global.textBlueColor,
            padding: 10,
          }}
        >
          {global.chooseYourLanguage}
        </Text>
        <CheckBox
          center
          title="English"
          iconRight
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={isEnglishLanguageChecked}
          onPress={() => englishSelected()}
        />
        <CheckBox
          center
          title="German"
          iconRight
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={isDeutschLanguageChecked}
          onPress={() => deutschSelected()}
        />
        <CheckBox
          center
          title="Dutch"
          iconRight
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={isDutchLanguageChecked}
          onPress={() => dutchSelected()}
        />
        <CheckBox
          center
          title="French"
          iconRight
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={isFrenchLanguageChecked}
          onPress={() => frenchSelected()}
        />
        <CheckBox
          center
          title="Italian"
          iconRight
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={isItalianLanguageChecked}
          onPress={() => italianSelected()}
        />
        <Button
          title={global.apply}
          type="clear"
          buttonStyle={{
            width: 100,
            alignSelf: "flex-end",
          }}
          onPress={() => toggleOverlay()}
        />
      </Overlay>
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

export default ChangeLanguageScreen;
