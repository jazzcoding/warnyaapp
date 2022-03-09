import React, { useRef } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Share,
} from "react-native";

import * as firebase from "firebase";
import "firebase/firestore";
import "../../db/global";
import "../../attribute/global";
import { Avatar, Button, Header, Input } from "react-native-elements";
import { useIsFocused } from "@react-navigation/core";
import LoadingPage from "../../attribute/LoadingPage";
import { ScrollView } from "react-native-gesture-handler";
import QRCodeProps from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
const AddParticipantScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  const [item, setItem] = React.useState([]);
  const [userInTheGroup, setUserInTheGroup] = React.useState([]);
  const currentUser = firebase.auth().currentUser;
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  const viewShot = useRef(null);
  React.useEffect(() => {
    setUsers([]);
    setUserInTheGroup([]);
    setItem(route.params.item);
    getUserInTheGroup(route.params.item.CHATDETAILS.key);
  }, [isFocused]);

  const onSave = () => {
    viewShot.current.capture().then((uri) => {
      try {
        MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert(
          global.alertSuccessTitle,
          global.textImageWasSuccessfullyDownloaded,
          [{ text: "Ok", onPress: () => console.log("No") }]
        );
      } catch (err) {
        alert(global.alertCatch);
      }
    });
  };

  const userExists = (id) => {
    return userInTheGroup.some(function (el) {
      return el.id === id;
    });
  };

  const getUserInTheGroup = async (id) => {
    try {
      const getParticipantDetails = await firebase
        .database()
        .ref("chatDetails/" + id + "/members");
      getParticipantDetails.once("value", (snapshot) => {
        snapshot.forEach((element) => {
          setUserInTheGroup([element.val()]);
        });
      });
    } catch (err) {
      alert(err);
    }
  };

  const updateSearch = async (value) => {
    try {
      setUsers([]);
      if (value === "") {
        console.log(null);
      } else {
        const getReceiverInfo = await firebase
          .database()
          .ref("users")
          .orderByChild("username")
          .startAt(value)
          .endAt(value + "\uf8ff");
        const getReceiverInfoUsernder = await firebase
          .database()
          .ref("users")
          .orderByChild("email")
          .startAt(value.toLowerCase())
          .endAt(value.toLowerCase() + "\uf8ff");
        getReceiverInfo.on("value", (snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((element) => {
              console.log(element.val().preferences);
              setUsers(Object.values(snapshot.val()));
            });
          } else {
            getReceiverInfoUsernder.on("value", (mysnapshot) => {
              if (mysnapshot.exists())
                mysnapshot.forEach((element) => {
                  //console.log(element.val());
                  console.log(element.val().preferences);
                  setUsers(Object.values(mysnapshot.val()));
                });
            });
          }
        });
      }
    } catch (err) {
      console.log("There is something wrong!", err.message);
    }
  };
  const addUserToTheGroup = async (id) => {
    setIsLoading(true);
    try {
      if (!userExists(id) && currentUser.uid !== id) {
        const addUser = await firebase
          .database()
          .ref(
            "chatDetails/" +
              route.params.item.CHATDETAILS.key +
              "/members/" +
              id
          );
        addUser.update({ id });

        const addUserChats = await firebase
          .database()
          .ref("userChats/" + id + "/" + route.params.item.CHATDETAILS.key);
        addUserChats.set({
          chatUID: route.params.item.CHATDETAILS.key,
        });
        Alert.alert(global.textAlert, `${global.textSuccesfullyInvited}`, [
          { text: "Ok", onPress: () => console.log("No") },
        ]);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        Alert.alert(global.textAlert, `${global.textUserIsAlreadyInTheGroup}`, [
          { text: "Ok", onPress: () => console.log("No") },
        ]);
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert(global.textAlert, `${global.alertCatch}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    }
  };

  const itemToRender = (item) => {
    if (item.preferences === "true") {
      return (
        <View style={styles.chatMessage}>
          <Avatar
            rounded
            source={
              item.userPicture
                ? {
                    uri: item.userPicture,
                  }
                : require("../../assets/person.png")
            }
            containerStyle={{ backgroundColor: "#f2f2f2" }}
          />
          <Text style={styles.TextStyle}>{item.email}</Text>
          <Button
            title={global.textInvite}
            type="solid"
            iconPosition="right"
            buttonStyle={styles.ButtonStyle}
            onPress={() => {
              addUserToTheGroup(item.id);
            }}
            titleStyle={{ fontSize: 8, marginLeft: 5, marginRight: 5 }}
          />
        </View>
      );
    } else {
      return null;
    }
  };
  if (isLoading === true) {
    <LoadingPage />;
  }
  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Header
          placement="left"
          containerStyle={{
            backgroundColor: "#38B3FE",
          }}
          centerComponent={{
            text: global.textAddParticipants,
            style: { color: "#fff", fontWeight: "bold", fontSize: 15 },
          }}
          leftComponent={{
            onPress: () => navigation.navigate("SendMessageScreen", { item }),
            icon: "arrow-back",
            iconStyle: { color: "#fff" },
            style: {
              margin: 10,
            },
          }}
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            color: "#707070",
            textAlign: "center",
            padding: 20,
          }}
        >
          {global.selectParticipantToJoin}
        </Text>

        <Input
          placeholder={global.searchText}
          inputContainerStyle={[
            styles.inputContainerStyle,
            { alignSelf: "center", paddingLeft: 10 },
          ]}
          rightIcon={{
            type: "Feather",
            name: "search",
            marginRight: 10,
            marginLeft: 10,
            color: global.iconGrayColor,
          }}
          onChangeText={(value) => updateSearch(value)}
        />
        <FlatList
          data={users}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => itemToRender(item)}
          style={{
            backgroundColor: "#f2f2f2",
          }}
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            color: "#707070",
            alignSelf: "center",
            padding: 20,
          }}
        >
          Or
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            color: "#707070",
            alignSelf: "center",
            padding: 20,
          }}
        >
          {global.sendInviteLink}
        </Text>
        <ViewShot
          ref={viewShot}
          options={{
            width: "100%",
            height: "100%",
            format: "jpg",
            quality: 1.0,
          }}
        >
          <View
            style={{
              alignSelf: "center",
              padding: 20,
              backgroundColor: "white",
            }}
          >
            <QRCodeProps
              value={route.params.item.CHATDETAILS.key}
              logo={require("../../assets/icon.png")}
              size={200}
            />
          </View>
        </ViewShot>
        <Text
          onPress={() => {
            onSave();
          }}
          style={{
            color: "#2F7FEB",
            padding: 5,
            alignSelf: "center",
            textDecorationLine: "underline",
            fontWeight: "bold",
          }}
        >
          {global.saveQRCodeToGallery}
        </Text>
        <Button
          title={global.textDone}
          type="solid"
          titleStyle={{ fontSize: 15 }}
          buttonStyle={[
            styles.ButtonStyle,
            { width: "50%", alignSelf: "center", marginTop: 100, padding: 10 },
          ]}
          onPress={() => navigation.navigate("SendMessageScreen", { item })}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  chatMessage: {
    backgroundColor: "#fff",
    width: 100,
    height: 150,
    padding: 10,
    borderRadius: 10,
    margin: 5,
    flexDirection: "column",
    alignItems: "center",
  },
  TextStyle: {
    textAlign: "center",
    color: "#707070",
    fontSize: 8,
    padding: 10,
    fontWeight: "bold",
  },
  FitToText: {
    flexDirection: "row",
  },
  ButtonStyle: {
    backgroundColor: "#2F7FEB",
    borderRadius: 100,
  },
  inputContainerStyle: {
    borderRadius: 100,
    borderColor: "#707070",
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderWidth: 0.5,
    backgroundColor: "#fff",
    width: "80%",
  },
});

export default AddParticipantScreen;
