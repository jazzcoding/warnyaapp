import React from "react";
import { Input, Button, Card, Avatar, Header } from "react-native-elements";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import HeaderDesign from "../../attribute/HeaderDesign";
import * as ImagePicker from "expo-image-picker";
import { uploadProfilePicture } from "../../db/firebaseAPI";
import "../../attribute/global";
import * as firebase from "firebase";
import LoadingPage from "../../attribute/LoadingPage";
import { useIsFocused } from "@react-navigation/core";
const ProfilePhotoScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      getPermission();
      setIsLoading(false);
    }, 3000);
  }, [isFocused]);

  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
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
      setImageUri(result.uri);
    }
  };
  const launchCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const uploadPicture = async (path) => {
    if (imageUri !== null) {
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
            uploadProfilePicture(navigation, url);
            setIsLoading(false);
          });
        });
      } catch (error) {
        alert(error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      navigation.navigate("LanguageScreen");
    }
  };

  if (isLoading === true) {
    return <LoadingPage />;
  }
  return (
    <View style={[styles.container, { paddingTop: 30 }]}>
      <HeaderDesign />
      <Text
        onPress={() => {
          setIsLoading(true);
          uploadPicture(imageUri);
        }}
        style={{
          position: "absolute",
          alignSelf: "flex-end",
          marginTop: 20,
          padding: 10,
          fontSize: 15,
          fontWeight: "bold",
          color: "#fff",
          elevation: 1,
        }}
      >
        {imageUri === null ? "SKIP" : "NEXT"}
      </Text>
      <Text
        style={[
          styles.TextStyle,
          { fontSize: global.fontTitleSize, color: global.textBlueColor },
        ]}
      >
        Add Your Photo?
      </Text>

      <Text
        style={[
          styles.TextStyle,
          {
            fontSize: global.fontTextSize,
            color: global.textGrayColor,
            padding: 20,
          },
        ]}
      >
        {global.profilePhotoText}
      </Text>

      <Image
        source={
          imageUri === null
            ? require("../../assets/uploadPhoto.jpeg")
            : {
                uri: imageUri,
              }
        }
        resizeMode="cover"
        resizeMethod="auto"
        style={{
          backgroundColor: "#fff",
          alignSelf: "center",
          height: 80,
          width: 80,
          borderRadius: 100,
        }}
      />
      <Button
        title="Find an Image"
        type="solid"
        titleStyle={{ fontSize: 15 }}
        buttonStyle={styles.ButtonStyle}
        onPress={() => pickImage()}
      />
      <Button
        title="Take a Photo"
        type="outline"
        titleStyle={{ fontSize: 15 }}
        buttonStyle={styles.ButtonStyle}
        onPress={() => launchCamera()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },

  ButtonStyle: {
    width: "50%",
    margin: 10,
    padding: 10,
    borderRadius: 100,
    alignSelf: "center",
    borderColor: "#707070",
    borderWidth: 2,
  },

  inputContainerStyle: {
    elevation: 1,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: global.inputWhiteColor,
  },
  TextStyle: {
    padding: 10,
    width: "100%",
    textAlign: "center",
  },
  FitToText: {
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});

export default ProfilePhotoScreen;
