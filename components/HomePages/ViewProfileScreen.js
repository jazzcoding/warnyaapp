import React from "react";
import { Button, Card, Input, Avatar, Header } from "react-native-elements";
import { View, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../../attribute/context";
import "../../attribute/global";
import * as firebase from "firebase";
import "firebase/firestore";
import "../../db/global";
import LoadingPage from "../../attribute/LoadingPage";
import { useIsFocused } from "@react-navigation/core";

const ViewProfileScreen = ({ route, navigation }) => {
  const [firstname, setFirstName] = React.useState("");
  const [lastname, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [userImage, setUserImage] = React.useState("");
  const [userDate, setUserDate] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const isFocused = useIsFocused();
  var item = route.params.item;

  React.useEffect(() => {
    setTimeout(() => {
      getUserProfile();
    }, 1000);
  }, [isFocused]);

  const getUserProfile = async () => {
    try {
      const userExist = await firebase
        .database()
        .ref("users/" + route.params.id);
      userExist.once("value").then((snapshot) => {
        setFirstName(snapshot.val().firstname);
        setLastName(snapshot.val().lastname);
        setUsername(snapshot.val().username);
        setUserImage(snapshot.val().userPicture);
        setUserDate(snapshot.val().date);
        setIsLoading(false);
      });
    } catch (err) {
      alert(err);
      setIsLoading(false);
    }
  };
  if (isLoading === true) {
    return <LoadingPage />;
  }
  return (
    <View style={styles.container}>
      <Header
        placement="left"
        containerStyle={{
          backgroundColor: "#38B3FE",
        }}
        centerComponent={{
          text: "Profile",
          style: {
            color: "#fff",
            fontWeight: "bold",
            fontSize: 15,
          },
        }}
        leftComponent={{
          onPress: () => {
            navigation.navigate("SendMessageScreen", { item });
          },
          icon: "arrow-back",
          iconStyle: { color: "#fff" },
          style: {
            margin: 10,
          },
        }}
      />
      <Avatar
        size="xlarge"
        rounded
        source={
          userImage
            ? {
                uri: userImage,
              }
            : require("../../assets/person.png")
        }
        containerStyle={{
          backgroundColor: "#f2f2f2",
          alignSelf: "center",
          marginTop: 50,
        }}
      ></Avatar>
      <Input
        label={global.textUsername}
        fontSize={15}
        labelStyle={{ fontSize: 15 }}
        inputContainerStyle={[styles.inputContainerStyle]}
        value={username}
        disabled={true}
      />
      <Input
        label={global.textFirstName}
        fontSize={15}
        labelStyle={{ fontSize: 15 }}
        inputContainerStyle={styles.inputContainerStyle}
        value={firstname}
        disabled={true}
      />
      <Input
        label={global.textLastName}
        fontSize={15}
        labelStyle={{ fontSize: 15 }}
        inputContainerStyle={styles.inputContainerStyle}
        disabled={true}
        value={lastname === "" ? "N/A" : lastname}
      />
      <Input
        label={global.textMemberSince}
        fontSize={15}
        labelStyle={{ fontSize: 15 }}
        inputContainerStyle={styles.inputContainerStyle}
        disabled={true}
        value={userDate}
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
    backgroundColor: "#2F7FEB",
    width: "50%",
    color: "#fff",
    height: 50,
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
    elevation: 0,
    margin: 10,
    borderRadius: 20,
    borderWidth: 1,
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
  TextStyle: {
    padding: 10,
    width: "100%",
    textAlign: "center",
  },
});

export default ViewProfileScreen;
