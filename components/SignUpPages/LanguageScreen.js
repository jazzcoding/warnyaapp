import React from "react";
import { Button, Card, CheckBox, Icon, Overlay } from "react-native-elements";
import { View, Text, Dimensions, StyleSheet, Alert } from "react-native";
import { registerLanguage } from "../../db/firebaseAPI";
import { AuthContext } from "../../attribute/context";
import { english } from "../../HelperClass/Language";
import { italian } from "../../HelperClass/Language";
import { french } from "../../HelperClass/Language";
import { dutch } from "../../HelperClass/Language";
import { deutsch } from "../../HelperClass/Language";
const LanguageScreen = () => {
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  //const [isLoading, setLoading] = React.useState(true);
  const { userSignedIn } = React.useContext(AuthContext);
  const [visible, setVisible] = React.useState(false);
  const [language, setLanguage] = React.useState("English");
  const [isEnglishLanguageChecked, setIsEnglishLanguageChecked] =
    React.useState(true);
  const [isDeutschLanguageChecked, setIsDeutschLanguageChecked] =
    React.useState(false);
  const [isDutchLanguageChecked, setIsDutchLanguageChecked] =
    React.useState(false);
  const [isFrenchLanguageChecked, setIsFrenchLanguageChecked] =
    React.useState(false);
  const [isItalianLanguageChecked, setIsItalianLanguageChecked] =
    React.useState(false);

  /*
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
*/

  const registerMyLanguage = async () => {
    registerLanguage(userSignedIn, language);
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
    setLanguage("Deutsch");
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
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.TextStyle,
          {
            fontSize: global.fontTitleSize,
            color: global.textBlueColor,
            fontWeight: "bold",
            marginTop: windowHeight / 4,
          },
        ]}
      >
        {global.language}
      </Text>

      <Button
        title={language}
        type="clear"
        titleStyle={{ color: "#fff" }}
        containerStyle={[styles.ButtonStyle, { backgroundColor: "#38B6FF" }]}
        onPress={() => toggleOverlay()}
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
      />

      <Button
        title={global.buttonContiue}
        type="clear"
        titleStyle={{ color: "#fff" }}
        containerStyle={[
          styles.ButtonStyle,
          { backgroundColor: "#2F7FEB", position: "absolute", bottom: 50 },
        ]}
        onPress={() => registerMyLanguage()}
      />

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
          title="Deutsch"
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
  },

  ButtonStyle: {
    width: "50%",
    padding: 5,
    borderRadius: 100,
    alignSelf: "center",
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
