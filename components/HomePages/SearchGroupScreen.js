import React from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import "../../db/global";
import { Avatar, Button, Header, Input } from "react-native-elements";
import { useIsFocused } from "@react-navigation/core";
const SearchGroupScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [animating, setAnimating] = React.useState(false);
  const [group, setGroup] = React.useState([]);
  const [user, setuser] = React.useState([]);
  const currentUser = firebase.auth().currentUser;

  React.useEffect(() => {
    setGroup([]);
    setuser([]);
  }, [isFocused]);

  const updateSearch = async (value) => {
    try {
      if (value === "") {
        console.log(null);
      } else {
        setAnimating(true);
        setGroup([]);
        const getReceiverInfo = await firebase
          .database()
          .ref("chatDetails/")
          .orderByChild("groupName")
          .startAt(value.toUpperCase())
          .endAt(value.toUpperCase() + "\uf8ff");
        var data = [];
        var isUserMember = null;
        getReceiverInfo.once("value", (snapshot) => {
          snapshot.forEach((element) => {
            if (currentUser.uid !== element.val().createdby) {
              if (element.val().members !== "undefined") {
                var mydata = [element.val().members];
                mydata.some((el) => {
                  if (el.hasOwnProperty(currentUser.uid)) {
                    isUserMember = true;
                  } else {
                    isUserMember = false;
                  }
                });
              } else {
                isUserMember = false;
              }
            } else {
              isUserMember = true;
            }

            data.push({
              CHATDETAILS: {
                key: element.key,
                groupName: element.val().groupName,
                groupImg: element.val().groupImg,
                isUserMember,
                visibility: element.val().visibility,
              },
            });
          });
          setGroup(data);
          console.log(data);
          setAnimating(false);
        });
      }
    } catch (err) {
      console.log("There is something wrong!", err.message);
    }
  };

  const joinGroup = async (item) => {
    const addUserChats = await firebase
      .database()
      .ref("userChats/" + currentUser.uid + "/" + item.CHATDETAILS.key);
    addUserChats.set({
      chatUID: item.CHATDETAILS.key,
    });
    const addUser = await firebase
      .database()
      .ref(
        "chatDetails/" + item.CHATDETAILS.key + "/members/" + currentUser.uid
      );
    addUser.update({ id: currentUser.uid });
    navigation.navigate("SendMessageScreen", { item });
  };

  const itemToRender = (item) => {
    if (item.CHATDETAILS.visibility === "Public") {
      return (
        <View style={styles.chatMessage}>
          <Avatar
            rounded
            size="small"
            source={{
              uri: item.CHATDETAILS.groupImg,
            }}
          />
          <Text style={styles.TextStyle}>{item.CHATDETAILS.groupName}</Text>
          <Button
            title={item.CHATDETAILS.isUserMember === true ? "joined" : "join"}
            type="solid"
            iconPosition="right"
            disabled={item.CHATDETAILS.isUserMember}
            buttonStyle={styles.ButtonStyle}
            onPress={() => {
              joinGroup(item);
            }}
            titleStyle={{ fontSize: 12, marginLeft: 5, marginRight: 5 }}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        placement="left"
        containerStyle={{
          backgroundColor: "#38B3FE",
        }}
        centerComponent={{
          text: global.textSearchGroup,
          style: { color: "#fff", fontWeight: "bold", fontSize: 15 },
        }}
        leftComponent={{
          onPress: () => navigation.navigate("HomepageScreen"),
          icon: "arrow-back",
          iconStyle: { color: "#fff" },
          style: {
            margin: 10,
          },
        }}
      />
      <Input
        placeholder={global.searchText}
        inputContainerStyle={styles.inputContainerStyle}
        leftIcon={{
          type: "Feather",
          name: "search",
          marginRight: 10,
          marginLeft: 10,
          color: global.iconGrayColor,
        }}
        onChangeText={(value) => updateSearch(value)}
        rightIcon={{
          type: "AntDesign",
          name: "close",
          color: "#707070",
        }}
      />
      {(() => {
        if (animating === true) {
          return (
            <ActivityIndicator
              animating={animating}
              color="#38B3FE"
              size="large"
              style={{
                alignSelf: "center",
                elevation: 1,
              }}
            />
          );
        } else {
          return null;
        }
      })()}

      {(() => {
        if (group.length > 0) {
          return null;
        } else {
          return (
            <Text style={{ alignSelf: "center", padding: 10 }}>
              {global.textNoGroupFound}
            </Text>
          );
        }
      })()}
      <FlatList
        data={group}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => itemToRender(item)}
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#fff",
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  chatMessage: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  TextStyle: {
    textAlign: "center",
    color: "black",
    fontSize: 15,
    padding: 10,
  },
  FitToText: {
    flexDirection: "row",
  },
  ButtonStyle: {
    backgroundColor: "#2F7FEB",
    borderRadius: 100,
    margin: 5,
    padding: 5,
  },
  inputContainerStyle: {
    borderRadius: 20,
    marginTop: 10,
    borderBottomWidth: 0,
    backgroundColor: "#f2f2f2",
  },
});

export default SearchGroupScreen;
