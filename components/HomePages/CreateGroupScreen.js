import React from "react";
import { Button, Card, Avatar, Header, Input } from "react-native-elements";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { AuthContext } from "../../attribute/context";
import "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import "../../db/global";
import { useIsFocused } from "@react-navigation/core";
import { ScrollView } from "react-native-gesture-handler";
const CreateGroupScreen = ({ navigation }) => {
  const { userSignedIn } = React.useContext(AuthContext);
  const [groupName, setGroupName] = React.useState("");
  const [groupImg, setGroupImg] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  const isFocused = useIsFocused();
  React.useEffect(() => {
    getPermission();
  }, []);

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
      setGroupImg(result.uri);
    }
  };

  return (
    <ScrollView>
      <View
        style={[styles.container, { height: windowHeight, width: windowWidth }]}
      >
        <Header
          placement="left"
          containerStyle={{
            backgroundColor: "#38B3FE",
          }}
          leftComponent={{
            icon: "arrow-back",
            color: "#fff",
            onPress: () => {
              userSignedIn();
            },
            style: { color: "#fff", fontWeight: "bold" },
          }}
          centerComponent={{
            text: global.textCreateGroup,
            style: { color: "#fff", fontWeight: "bold", fontSize: 15 },
          }}
        />
        <Text
          style={[
            styles.TextStyle,
            {
              fontSize: 17,
              padding: 10,
              marginTop: 50,
              color: "#2F7FEB",
              fontWeight: "bold",
            },
          ]}
        >
          {global.textNameOfGroup}
        </Text>
        <Input
          placeholder={global.textTypeYourGroupNameHere}
          fontSize={12}
          inputContainerStyle={[
            styles.inputContainerStyle,
            { borderRadius: 100 },
          ]}
          leftIcon={{
            type: "Feather",
            name: "group",
            marginRight: 10,
            marginLeft: 20,
            color: "#707070",
          }}
          maxLength={20}
          onChangeText={(value) => setGroupName(value.toUpperCase())}
        />

        <Text style={[styles.TextStyle, { fontSize: 15, color: "#9E9E9E" }]}>
          {global.textSelectImage}
        </Text>
        <TouchableOpacity onPress={() => pickImage()}>
          <Image
            resizeMode="cover"
            style={{
              backgroundColor: "#fff",
              height: 70,
              width: 70,
              margin: 20,
              alignSelf: "center",
            }}
            source={
              groupImg === ""
                ? require("../../assets/sidenavicon/image.png")
                : { uri: groupImg }
            }
          />
        </TouchableOpacity>
        <Button
          title={global.btnContinue}
          type="solid"
          titleStyle={{ fontSize: 15, fontWeight: "bold" }}
          buttonStyle={styles.ButtonStyle}
          onPress={() => {
            if (groupName.trim() !== "") {
              navigation.navigate("GroupSettingsCreen", {
                groupName,
                groupImg,
              });
            } else {
              Alert.alert(
                global.alertErrorTitle,
                global.textPleaseEnterGroupName,
                [{ text: "Ok", onPress: () => console.log("No") }]
              );
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },

  ButtonStyle: {
    padding: 15,
    width: "50%",
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 50,
  },
  FormContainer: {
    margin: 0,
    borderWidth: 0,
    elevation: 0,
  },

  inputContainerStyle: {
    margin: 20,
    elevation: 1,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#2F7FEB",
  },
  TextStyle: {
    padding: 10,
    width: "100%",
    textAlign: "center",
  },
});

export default CreateGroupScreen;
