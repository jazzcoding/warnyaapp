import React from "react";
import { ActivityIndicator, Alert, Dimensions, View } from "react-native";
import { Button, Icon, Image, Overlay, Text } from "react-native-elements";
import * as firebase from "firebase";
import "firebase/firestore";
import "../../db/global";
import "../../attribute/global";

const QRImage = ({ route, navigation }) => {
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  const [visible, setVisible] = React.useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const onPressDone = async () => {
    console.log(route.params.imageUrl);
    const currentUser = firebase.auth().currentUser;
    try {
      const checkGroupExist = await firebase
        .database()
        .ref("chatDetails/" + route.params.imageUrl);
      checkGroupExist.once("value", async (snap) => {
        if (snap.exists()) {
          const addUser = await firebase
            .database()
            .ref(
              "chatDetails/" +
                route.params.imageUrl +
                "/members/" +
                currentUser.uid
            );
          addUser.update({ id: currentUser.uid });
          const addUserChats = await firebase
            .database()
            .ref("userChats/" + currentUser.uid + "/" + route.params.imageUrl);
          addUserChats.set({
            chatUID: route.params.imageUrl,
          });
          toggleOverlay();
        } else {
          Alert.alert(global.textAlert, global.textGroupDoesNotExist, [
            { text: "Ok", onPress: () => console.log("no") },
          ]);
        }
      });
    } catch (err) {
      Alert.alert(global.textAlert, `${global.textGroupDoesNotExist}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    }
  };

  return (
    <View style={{ display: "flex", flex: 1, width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "100%",
          borderWidth: 0.5,
        }}
      >
        <Button
          title={global.textCancel}
          type="solid"
          icon={<Icon name="close" iconStyle={{ color: "#38B3FE" }} />}
          titleStyle={{ fontSize: 12, color: "#38B3FE", marginLeft: 5 }}
          buttonStyle={{
            backgroundColor: "#fff",

            borderColor: "#707070",
            width: "90%",
            color: "#fff",
            padding: 15,
            borderRadius: 0,
          }}
          onPress={() => {
            navigation.navigate("HomepageScreen");
          }}
        />
        <Button
          title={global.textDone}
          type="solid"
          icon={<Icon name="check" iconStyle={{ color: "#38B3FE" }} />}
          titleStyle={{ fontSize: 12, color: "#38B3FE", marginLeft: 5 }}
          buttonStyle={{
            backgroundColor: "#fff",
            borderRadius: 0,
            borderColor: "#707070",
            width: "90%",
            color: "#fff",
            padding: 15,
          }}
          onPress={() => {
            onPressDone();
          }}
        />
      </View>
      <View style={{ width: "100%", height: "70%", backgroundColor: "black" }}>
        <Image
          source={{ uri: route.params.imageUri }}
          containerStyle={{ width: "100%", height: "100%" }}
          PlaceholderContent={<ActivityIndicator />}
        />
      </View>
      <View
        style={{ width: "100%", height: "30%", backgroundColor: "#38B3FE" }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            justifyContent: "center",
            marginTop: "15%",
          }}
        >
          {" "}
          {global.makeSureQrCode}
        </Text>
      </View>
      <Overlay
        isVisible={visible}
        overlayStyle={{
          width: windowWidth - 50,
          alignItems: "center",
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: "#707070",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            textAlign: "center",
            color: global.textBlueColor,
            alignSelf: "center",
            padding: 10,
          }}
        >
          {global.textSuccesfullyInvited}
        </Text>
        <View style={{ flexDirection: "row", margin: 20 }}>
          <Button
            type="clear"
            containerStyle={{
              margin: 5,
              width: "50%",
              borderRadius: 100,
              borderWidth: 1,
              borderColor: "#707070",
              backgroundColor: "#2F7FEB",
            }}
            title={global.textGoNow}
            titleStyle={{
              marginLeft: 5,
              color: "#fff",
              fontSize: 15,
            }}
            onPress={() => {
              toggleOverlay();
              navigation.navigate("HomepageScreen");
            }}
          />
        </View>
      </Overlay>
    </View>
  );
};

export default QRImage;
