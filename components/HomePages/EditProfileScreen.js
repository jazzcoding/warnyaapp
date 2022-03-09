import React from "react";
import { Button, Card, Input, Avatar } from "react-native-elements";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import "../../attribute/global";
import * as firebase from "firebase";
import "firebase/firestore";
import "../../db/global";
import { registerName } from "../../db/firebaseAPI";
import LoadingPage from "../../attribute/LoadingPage";
import { useIsFocused } from "@react-navigation/core";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";
import { AdMobInterstitial } from "expo-ads-admob";
import moment from "moment";

const EditProfileScreen = ({ navigation }) => {
  const [firstname, setFirstName] = React.useState("");
  const [lastname, setLastName] = React.useState("");
  const [usernamed, setUsernamed] = React.useState(true);
  const [firstnamed, setFirstNamed] = React.useState(true);
  const [lastnamed, setLastNamed] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [userImage, setUserImage] = React.useState("");
  const [useroldImage, setoldImage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const currentUser = firebase.auth().currentUser;
  const isFocused = useIsFocused();
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  React.useEffect(() => {
    setIsLoading(true);
    setFirstNamed(true);
    setLastNamed(true);
    setTimeout(() => {
      getPermission();
      getUserProfile();
    }, 1000);
  }, [isFocused]);

  const updateProfile = async () => {
    setIsLoading(true);
    if (useroldImage !== userImage) {
      uploadPicture(userImage);
    }
    if (firstname.trim() === "" || username.trim() === "") {
      Alert.alert(global.alertErrorTitle, global.alertErrorMessage, [
        { text: global.buttonOk, onPress: () => console.log("No") },
      ]);
    } else {
      registerName(firstname, lastname, username);
      Alert.alert(global.alertSuccessTitle, global.alertSuccessMessage, [
        { text: global.ok, onPress: () => console.log("No") },
      ]);
      getUserProfile(userImage);
      setFirstNamed(true);
      setLastNamed(true);
      setUsernamed(true);
      showAds();
    }
    setIsLoading(false);
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
  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(global.alertPermissionToCamera);
      }
    }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setUserImage(result.uri);
    }
  };

  const uploadPicture = async (path) => {
    try {
      var imagekey = firebase.database().ref().push().getKey();
      const response = await fetch(path);
      const blob = await response.blob();
      var ref = await firebase
        .storage()
        .ref()
        .child("my-image/" + imagekey);
      ref.put(blob).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url) => {
          const saveLink = firebase.database().ref("users/" + currentUser.uid);
          saveLink.update({ userPicture: url });
          setIsLoading(false);
        });
      });
    } catch (error) {
      alert(global.alertCatch);
      setIsLoading(false);
    }
  };

  const getUserProfile = async () => {
    try {
      const userExist = await firebase
        .database()
        .ref("users/" + currentUser.uid);
      userExist.on("value", (snapshot) => {
        setFirstName(snapshot.val().firstname);
        setLastName(snapshot.val().lastname);
        setUsername(snapshot.val().username);
        if (snapshot.val().userPicture === null) {
          setUserImage(
            "https://firebasestorage.googleapis.com/v0/b/warn-ya-58062.appspot.com/o/defaultProfile.png?alt=media&token=16b4eb8b-5b15-4bdf-b984-540678115ad3"
          );
        } else {
          setUserImage(snapshot.val().userPicture);
          setoldImage(snapshot.val().userPicture);
        }
        setIsLoading(false);
      });
    } catch (err) {
      alert(alertCatch);
      setIsLoading(false);
    }
  };
  if (isLoading === true) {
    return <LoadingPage />;
  }
  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View
        style={[
          styles.container,
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Avatar
          size={90}
          rounded
          source={{
            uri:
              userImage == null
                ? "https://firebasestorage.googleapis.com/v0/b/warn-ya-58062.appspot.com/o/defaultProfile.png?alt=media&token=16b4eb8b-5b15-4bdf-b984-540678115ad3"
                : userImage,
          }}
          containerStyle={{
            backgroundColor: "#f2f2f2",
            alignSelf: "center",
            marginBottom: 10,
            marginTop: 70,
          }}
          rounded
        >
          <Avatar.Accessory
            name="edit"
            type="entypo"
            color="#fff"
            size={25}
            backgroundColor="#194A76"
            padding={3}
            borderRadius={100}
            onPress={() => pickImage()}
          />
        </Avatar>
        <Input
          label={global.textUsername}
          fontSize={15}
          labelStyle={{ fontSize: 15, fontWeight: "100" }}
          inputContainerStyle={[styles.inputContainerStyle]}
          onChangeText={(value) => setUsername(value)}
          inputStyle={{
            color: "#194A76",
            fontWeight: "bold",
            paddingLeft: 10,
          }}
          disabledInputStyle={{ color: "#194A76", fontWeight: "bold" }}
          rightIcon={{
            size: 12,
            type: "Entypo",
            name: "edit",
            color: "#fff",
            containerStyle: {
              backgroundColor: "#2F7FEB",
              borderRadius: 100,
              padding: 8,
              marginRight: 10,
            },
            onPress: () => {
              setUsernamed(!usernamed);
            },
          }}
          value={username}
          disabled={usernamed}
        />
        <Input
          label={global.textFirstName}
          fontSize={15}
          labelStyle={{ fontSize: 15, fontWeight: "100" }}
          inputContainerStyle={styles.inputContainerStyle}
          onChangeText={(value) => setFirstName(value)}
          inputStyle={{
            color: "194A76",
            fontWeight: "bold",
            paddingLeft: 10,
          }}
          disabledInputStyle={{ color: "#194A76", fontWeight: "bold" }}
          rightIcon={{
            size: 12,
            type: "Entypo",
            name: "edit",
            color: "#fff",
            containerStyle: {
              backgroundColor: "#2F7FEB",
              borderRadius: 100,
              padding: 8,
              marginRight: 10,
            },
            onPress: () => {
              setFirstNamed(!firstnamed);
            },
          }}
          value={firstname}
          disabled={firstnamed}
        />
        <Input
          label={global.textLastName}
          fontSize={15}
          labelStyle={{ fontSize: 15, fontWeight: "100" }}
          inputContainerStyle={styles.inputContainerStyle}
          onChangeText={(value) => setLastName(value)}
          disabled={lastnamed}
          inputStyle={{
            color: "#194A76",
            fontWeight: "bold",
            padding: 0,
          }}
          disabledInputStyle={{ color: "#194A76", fontWeight: "bold" }}
          rightIcon={{
            size: 12,
            type: "Entypo",
            name: "edit",
            color: "#fff",
            containerStyle: {
              backgroundColor: "#2F7FEB",
              borderRadius: 100,
              padding: 8,
              marginRight: 10,
            },
            onPress: () => {
              setLastNamed(!lastnamed);
            },
          }}
          value={lastname === "" ? "N/A" : lastname}
        />
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-evenly",
            marginLeft: 20,
            marginRight: 20,
            marginTop: 10,
          }}
        >
          <Button
            title={global.buttonTitle}
            type="solid"
            titleStyle={{ fontSize: 12 }}
            buttonStyle={styles.ButtonStyle}
            onPress={() => updateProfile()}
          />
          <Button
            title={global.textBack}
            type="solid"
            titleStyle={{ fontSize: 12, color: "#2F7FEB" }}
            buttonStyle={[styles.ButtonStyle, { backgroundColor: "#fff" }]}
            onPress={() => {
              navigation.navigate("HomepageScreen");
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
  },

  ButtonStyle: {
    borderWidth: 1,
    borderColor: "#707070",
    minWidth: "95%",
    color: "#fff",
    borderRadius: 100,
    alignSelf: "center",
    margin: 10,
    padding: 15,
  },
  inputContainerStyle: {
    borderRadius: 100,
    borderWidth: 1,
    padding: 0,
    borderColor: "#707070",
    marginLeft: 20,
    height: 45,
    marginRight: 20,
    paddingLeft: 10,
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  TextStyle: {
    width: "100%",
    textAlign: "center",
  },
});

export default EditProfileScreen;
