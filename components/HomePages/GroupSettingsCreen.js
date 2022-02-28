import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { CheckBox, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import "../../attribute/global";

const GroupSettingsCreen = ({ route, navigation }) => {
  const [allow, setAllow] = React.useState(true);
  const [dont, setDont] = React.useState(false);
  const [publicStatus, setPublicStatus] = React.useState(true);
  const [privateStatus, setPrivateStatus] = React.useState(false);
  const [messageStatus, setMessageStatus] = React.useState("Allow");
  const [visibilityStatus, setVisibilityStatus] = React.useState("Public");
  const [groupName, setGroupName] = React.useState("");
  const [groupImg, setGroupImg] = React.useState("");
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  React.useEffect(() => {
    setGroupName(route.params.groupName);
    setGroupImg(route.params.groupImg);
  }, []);
  const radioAllow = () => {
    setAllow(true);
    setDont(false);
    setMessageStatus("Allow");
  };

  const radioDont = () => {
    setAllow(false);
    setDont(true);
    setMessageStatus("DontAllow");
  };

  const radioPublic = () => {
    setPublicStatus(true);
    setPrivateStatus(false);
    setVisibilityStatus("Public");
  };

  const radioPrivate = () => {
    setPublicStatus(false);
    setPrivateStatus(true);
    setVisibilityStatus("Private");
  };

  return (
    <ScrollView>
      <View
        style={[styles.container, { height: windowHeight, width: windowWidth }]}
      >
        <Text style={styles.TextStyle}>{global.textParticipantMessages}</Text>
        <CheckBox
          title={global.textAllow}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={allow}
          textStyle={{ fontSize: 15, color: "#707070", fontWeight: "bold" }}
          containerStyle={styles.CheckBoxContainer}
          onPress={() => radioAllow()}
        />
        <CheckBox
          title={global.textDontAllow}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={dont}
          textStyle={{ fontSize: 15, color: "#707070", fontWeight: "bold" }}
          containerStyle={styles.CheckBoxContainer}
          onPress={() => radioDont()}
        />
        <Text style={styles.TextStyle}>{global.textSelectVisibility}</Text>

        <CheckBox
          title={global.textPublic}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={publicStatus}
          textStyle={{ fontSize: 15, color: "#707070", fontWeight: "bold" }}
          containerStyle={styles.CheckBoxContainer}
          onPress={() => radioPublic()}
        />
        <CheckBox
          title={global.textPrivate}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={privateStatus}
          textStyle={{ fontSize: 15, color: "#707070", fontWeight: "bold" }}
          containerStyle={styles.CheckBoxContainer}
          onPress={() => radioPrivate()}
        />

        <Button
          title={global.textContinue}
          type="solid"
          buttonStyle={styles.ButtonStyle}
          onPress={() =>
            navigation.navigate("ChooseParticipant", {
              groupName,
              groupImg,
              messageStatus,
              visibilityStatus,
            })
          }
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: global.backgroundWhiteColor,
    flex: 1,
  },
  inputContainerStyle: {
    elevation: 0,
    borderRadius: 20,
    margin: 20,
    borderWidth: 1,
    backgroundColor: global.inputWhiteColor,
  },
  TextStyle: {
    padding: 20,
    width: "100%",
    fontSize: global.fontTitleSize,
    color: global.textBlueColor,
    textAlign: "center",
    alignItems: "center",
    marginTop: 50,
  },
  FitToText: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    elevation: 5,
    margin: 1,
    alignItems: "center",
  },
  CheckBoxContainer: {
    backgroundColor: "#fff",
    borderWidth: 0,
  },
  ButtonStyle: {
    height: 50,
    width: 200,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 50,
  },
});

export default GroupSettingsCreen;
