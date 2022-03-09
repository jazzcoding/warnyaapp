import { BarCodeScanner } from "expo-barcode-scanner";
import React from "react";
import * as firebase from "firebase";
import "firebase/firestore";
import "../../db/global";
import "../../attribute/global";
import * as ImagePicker from "expo-image-picker";

import {
  Linking,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
} from "react-native";
import { Button, Overlay, Header, Icon } from "react-native-elements";

const QRCodeScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [userInTheGroup, setUserInTheGroup] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  React.useEffect(() => {
    getCammeraPermission();
  }, []);

  const getCammeraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return (
      <View
        style={{
          padding: 0,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          padding: 10,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {global.textPermissionNotGrantd}
        </Text>
        <Text style={{ marginTop: 5 }}>
          {global.textPermissionGoToSettings}
        </Text>
        <View style={styles.fixToText}>
          <TouchableOpacity
            style={{
              borderRadius: 10,
              alignItems: "center",
              margin: 5,
              padding: 5,
              width: "20%",
              backgroundColor: "#6495ed",
            }}
            onPress={() => Linking.openSettings()}
          >
            <Text style={{ color: "#fff" }}>{global.textSettings}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 10,
              alignItems: "center",
              margin: 5,
              padding: 5,
              width: "20%",
              backgroundColor: "#6495ed",
            }}
            onPress={() => {
              getCammeraPermission();
            }}
          >
            <Text style={{ color: "#fff" }}>{global.textRefresh}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(global.alertPermissionToCamera);
      } else {
        pickImage();
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 6],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log(result);
      const results = await BarCodeScanner.scanFromURLAsync(result.uri);
      if (results.length) {
        results.map(function (dataResult) {
          navigation.navigate("QRImage", {
            imageUrl: dataResult.data,
            imageUri: result.uri,
          });
          console.log(dataResult.data);
        });
      } else {
        alert(global.textInvialidQRImage);
      }
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    const currentUser = firebase.auth().currentUser;
    setScanned(true);
    try {
      const checkGroupExist = await firebase
        .database()
        .ref("chatDetails/" + data);
      checkGroupExist.once("value", async (snap) => {
        if (snap.exists()) {
          const addUser = await firebase
            .database()
            .ref("chatDetails/" + data + "/members/" + currentUser.uid);
          addUser.update({ id: currentUser.uid });
          const addUserChats = await firebase
            .database()
            .ref("userChats/" + currentUser.uid + "/" + data);
          addUserChats.set({
            chatUID: data,
          });
          toggleOverlay();
        } else {
          Alert.alert(global.textAlert, global.textGroupDoesNotExist, [
            { text: "Ok", onPress: () => setScanned(false) },
          ]);
        }
      });
    } catch (err) {
      Alert.alert(global.textAlert, `${global.alertCatch}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    }
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned()}
      style={[StyleSheet.absoluteFill, styles.container]}
    >
      <Header
        containerStyle={{
          backgroundColor: "#38B3FE",
          elevation: 0,
          borderBottomWidth: 0,
        }}
        leftComponent={{
          onPress: () => navigation.navigate("HomepageScreen"),
          icon: "arrow-back",
          iconStyle: { color: "#fff" },
          containerStyle: {
            margin: 10,
          },
        }}
      />
      <View style={{ backgroundColor: "#38B3FE", padding: 20 }}>
        <Button
          iconRight
          title={global.textUseImageFromLibrary}
          type="solid"
          icon={
            <Icon
              name="arrow-right"
              iconStyle={{
                color: "#fff",
                backgroundColor: "#38B3FE",
                borderRadius: 100,
              }}
            />
          }
          titleStyle={{ fontSize: 12, color: "#38B3FE", marginRight: 10 }}
          buttonStyle={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#707070",
            minWidth: "90%",
            color: "#fff",
            borderRadius: 100,
            alignSelf: "center",
            padding: 15,
          }}
          onPress={() => {
            getPermission();
          }}
        />
      </View>
      <Image
        source={require("../../assets/scan.png")}
        resizeMode="stretch"
        style={{
          width: "70%",
          height: "40%",
          justifyContent: "center",
          alignSelf: "center",
          marginTop: windowHeight / 10,
        }}
      />
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
      <Text
        style={{
          marginTop: 100,
          color: "#fff",
          position: "absolute",
          elevation: 2,
          height: "20%",
          width: "100%",
          paddingTop: "15%",
          textAlign: "center",
          backgroundColor: "#38B3FE",
          bottom: 0,
        }}
      >
        {global.makeSureQrCode}
      </Text>
    </BarCodeScanner>
  );
};
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#38B3FE",
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    marginTop: 20,
  },
});

export default QRCodeScanner;
