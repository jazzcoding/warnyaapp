import React from "react";
import * as firebase from "firebase";
import "firebase/firestore";
import "../../db/global";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Header, Avatar, Icon, Button, Overlay } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import LoadingPage from "../../attribute/LoadingPage";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from "react-native-popup-menu";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
const SendMessageScreen = ({ route, navigation }) => {
  const currentUser = firebase.auth().currentUser;
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageArray, setMessageArray] = React.useState([]);
  const isFocused = useIsFocused();
  const [visible, setVisible] = React.useState(false);
  const [kickVisible, setKickVisible] = React.useState(false);
  const [seenby, setSeenby] = React.useState("");
  const [members, setMembers] = React.useState("");
  const [item, setItem] = React.useState("");
  const [messageToDelete, setMessageToDelete] = React.useState("");
  const [userToKick, setUserToKick] = React.useState("");
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  React.useEffect(() => {
    setItem(route.params.item);
    setIsLoading(true);
    setTimeout(async () => {
      try {
        await firebase
          .database()
          .ref("chatDetails/" + route.params.item.CHATDETAILS.key + "/seenby")
          .once("value", (snap) => {
            let total = 0;
            snap.forEach(() => {
              total += 1;
            });
            setSeenby(total);
          });
        await firebase
          .database()
          .ref("chatDetails/" + route.params.item.CHATDETAILS.key + "/members")
          .once("value", (snap) => {
            let total = 0;
            snap.forEach(() => {
              total += 1;
            });
            setMembers(total);
          });

        const getLastMessageSent = await firebase
          .database()
          .ref("chatsMessages/" + route.params.item.CHATDETAILS.key);
        getLastMessageSent.on("value", function (snapshot) {
          setMessageArray([]);
          var mychatArray = [];
          snapshot.forEach(function (element) {
            const getUserPicture = firebase
              .database()
              .ref("users/" + element.val().sentBy);
            getUserPicture.on("value", (mydata) => {
              mychatArray.push({
                key: element.key,
                message: element.val().message,
                sentBy: element.val().sentBy,
                messageDateAndTime: element.val().messageDateAndTime,
                userPicture: mydata.val().userPicture,
                type: element.val().type,
                warningPhoto: element.val().warningPhoto,
                date: element.val().date,
                time: element.val().time,
              });
              setMessageArray(mychatArray);
            });
          });
        });
        setIsLoading(false);
        //getMessageData(route.params.item.CHATDETAILS.key);
      } catch (error) {
        alert(error);
      }
      return () => {
        firebase
          .database()
          .ref("chatsMessages/" + route.params.item.CHATDETAILS.key)
          .off("value", getLastMessageSent);
      };
    }, 3000);
  }, [isFocused]);
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const toggleKickOverly = () => {
    setKickVisible(!kickVisible);
  };

  const deleteMessage = async (item) => {
    try {
      const sentdate = moment().format("MM/DD/YYYY HH:mm");
      const deleteUserMessage = await firebase
        .database()
        .ref(
          "chatsMessages/" + route.params.item.CHATDETAILS.key + "/" + item.key
        );
      const updateChatDetails = await firebase
        .database()
        .ref("chatDetails/" + route.params.item.CHATDETAILS.key);
      const getChatDetails = await firebase
        .database()
        .ref("chatDetails/" + route.params.item.CHATDETAILS.key);
      getChatDetails.once("value", function (snapshot) {
        if (item.message === snapshot.val().lastMessageSent) {
          updateChatDetails.update({
            lastMessageSent: "Massage removed",
            messageDateAndTime: sentdate,
          });
        }
      });
      deleteUserMessage.remove();
    } catch (err) {
      setIsLoading(false);
      alert(err);
    }
  };

  const viewProfile = async (id) => {
    var item = route.params.item;
    navigation.navigate("ViewProfileScreen", { id, item });
  };
  const kickUser = async (id) => {
    try {
      const getMemberID = await firebase
        .database()
        .ref("chatDetails/" + route.params.item.CHATDETAILS.key + "/members")
        .orderByChild("id")
        .startAt(id)
        .endAt(id);
      getMemberID.once("value", async (snapshot) => {
        if (snapshot.exists()) {
          const removeMember = await firebase
            .database()
            .ref(
              "chatDetails/" +
                route.params.item.CHATDETAILS.key +
                "/members/" +
                id
            );
          removeMember.remove();
          const removeMessage = await firebase
            .database()
            .ref("userChats/" + id + "/" + route.params.item.CHATDETAILS.key);
          removeMessage.remove();
          alert("Successfully removed user to the group");
        } else {
          alert("user was already removed in this group chat");
        }
      });
    } catch (err) {
      setIsLoading(false);
      alert(err);
    }
  };

  if (isLoading === true) {
    return <LoadingPage />;
  }
  const itemToRender = (item) => {
    if (item.type === "created") {
      return (
        <View
          style={{
            padding: 10,
            alignContent: "center",
          }}
        >
          <Text style={{ padding: 20, color: "#2F7FEB" }}>
            {item.message} {global.textWasRecentlyCreated}{" "}
            {item.messageDateAndTime.substring(3, 6)}
            {item.messageDateAndTime.substring(0, 2)}
            {item.messageDateAndTime.substring(5)}
          </Text>
        </View>
      );
    } else if (item.type === "text" && item.sentBy === currentUser.uid) {
      return (
        <View style={styles.chatContainer}>
          <Text style={styles.userTimeStyle}>
            {item.messageDateAndTime.substring(10, 16)}
          </Text>
          <View style={styles.userChatConatiner}>
            <Avatar
              size="small"
              rounded
              source={
                item.userPicture
                  ? {
                      uri: item.userPicture,
                      alignSelf: "center",
                    }
                  : require("../../assets/person.png")
              }
              containerStyle={{ margin: 5 }}
            />
            <View style={styles.userMessageContainer}>
              <Text
                multiline={true}
                style={[styles.userTextStyle, { maxWidth: "100%" }]}
              >
                {item.message}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (item.type === "text" && item.sentBy !== currentUser.uid) {
      return (
        <View style={styles.senderContainer}>
          <Text style={styles.senderTimeStyle}>
            {item.messageDateAndTime.substring(10, 16)}
          </Text>
          <View style={styles.senderChatConatiner}>
            <Avatar
              size="small"
              rounded
              source={
                item.userPicture === ""
                  ? require("../../assets/person.png")
                  : {
                      uri: item.userPicture,
                      alignSelf: "center",
                    }
              }
              containerStyle={{ margin: 5 }}
            />
            <View style={styles.senderMessageContainer}>
              <Text multiline={true} style={styles.senderTextStyle}>
                {item.message}
              </Text>
              {(() => {
                if (
                  route.params.item.CHATDETAILS.createdby === currentUser.uid
                ) {
                  return (
                    <Menu>
                      <MenuTrigger>
                        <Icon
                          name="dots-three-horizontal"
                          type="entypo"
                          color="white"
                          size={10}
                          containerStyle={{ padding: 3 }}
                        />
                      </MenuTrigger>
                      <MenuOptions>
                        <MenuOption
                          fontSize={15}
                          color="#38B3FE"
                          onSelect={() => viewProfile(item.sentBy)}
                          text={global.textViewProfile}
                        />
                        <MenuOption
                          fontSize={15}
                          color="#38B3FE"
                          onSelect={() => {}}
                          text={global.textKick}
                        />
                      </MenuOptions>
                    </Menu>
                  );
                } else {
                  return (
                    <Menu>
                      <MenuTrigger>
                        <Icon
                          name="dots-three-horizontal"
                          type="entypo"
                          color="white"
                          size={10}
                          containerStyle={{ padding: 3 }}
                        />
                      </MenuTrigger>
                      <MenuOptions>
                        <MenuOption
                          fontSize={15}
                          color="#38B3FE"
                          onSelect={() => viewProfile(item.sentBy)}
                          text="View Profile"
                        />
                      </MenuOptions>
                    </Menu>
                  );
                }
              })()}
            </View>
          </View>
        </View>
      );
    } else if (item.type === "alert" && item.sentBy === currentUser.uid) {
      var now = moment().format("MM/DD/YYYY HH:mm");
      if (moment(item.date + " " + item.time).isSameOrAfter(moment(now))) {
        return (
          <SafeAreaView style={styles.chatContainer}>
            <Text style={styles.userTimeStyle}>
              {item.messageDateAndTime.substring(10, 16)}
            </Text>
            <View style={styles.userChatConatiner}>
              <Avatar
                size="small"
                rounded
                source={
                  item.userPicture
                    ? {
                        uri: item.userPicture,
                        alignSelf: "center",
                      }
                    : require("../../assets/person.png")
                }
                containerStyle={{
                  margin: 5,

                  backgroundColor: "#f2f2f2",
                }}
              />
              <View style={styles.userMessageContainer}>
                <Text
                  multiline={true}
                  style={[styles.userTextStyle, { maxWidth: "80%" }]}
                >
                  {item.message}
                </Text>
                <Text
                  style={{
                    position: "absolute",
                    bottom: 0,
                    color: "#03C04A",
                    left: 10,
                    fontSize: 12,
                  }}
                >
                  {seenby}/{members} Seen
                </Text>
                <Image
                  source={{ uri: item.warningPhoto }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                    alignSelf: "center",
                  }}
                  PlaceholderContent={
                    <ActivityIndicator style={{ color: "#38B3FE" }} />
                  }
                />
                <Menu>
                  <MenuTrigger>
                    <Icon
                      name="dots-three-horizontal"
                      type="entypo"
                      color="white"
                      size={10}
                      containerStyle={{ paddingLeft: 3 }}
                    />
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption
                      fontSize={15}
                      color="#38B3FE"
                      onSelect={() => {
                        setMessageToDelete(item);
                        toggleOverlay();
                      }}
                      text={global.textDelete}
                    />
                  </MenuOptions>
                </Menu>
              </View>
            </View>
          </SafeAreaView>
        );
      }
    } else if (item.type === "alert" && item.sentBy !== currentUser.uid) {
      var now = moment().format("MM/DD/YYYY HH:mm");
      if (moment(item.date + " " + item.time).isSameOrAfter(moment(now))) {
        return (
          <View style={styles.senderContainer}>
            <Text style={styles.senderTimeStyle}>
              {item.messageDateAndTime.substring(10, 16)}
            </Text>
            <View style={styles.senderChatConatiner}>
              <Avatar
                size="small"
                rounded
                source={
                  item.userPicture
                    ? {
                        uri: item.userPicture,
                        alignSelf: "center",
                      }
                    : require("../../assets/person.png")
                }
                containerStyle={{ margin: 5, backgroundColor: "#f2f2f2" }}
              />

              <View style={styles.senderMessageContainer}>
                <Text
                  multiline
                  style={[styles.senderTextStyle, { maxWidth: "75%" }]}
                >
                  {item.message}
                </Text>
                <Image
                  source={{ uri: item.warningPhoto }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                    alignSelf: "center",
                  }}
                  PlaceholderContent={
                    <ActivityIndicator style={{ color: "#38B3FE" }} />
                  }
                />
                {(() => {
                  if (
                    route.params.item.CHATDETAILS.createdby === currentUser.uid
                  ) {
                    return (
                      <Menu>
                        <MenuTrigger>
                          <Icon
                            name="dots-three-horizontal"
                            type="entypo"
                            color="white"
                            size={10}
                            containerStyle={{ padding: 3 }}
                          />
                        </MenuTrigger>
                        <MenuOptions>
                          <MenuOption
                            fontSize={15}
                            color="#38B3FE"
                            onSelect={() => viewProfile(item.sentBy)}
                            text={global.textViewProfile}
                          />
                          <MenuOption
                            fontSize={15}
                            color="#38B3FE"
                            onSelect={() => {
                              toggleKickOverly();
                              setUserToKick(item.sentBy);
                            }}
                            text={global.textKick}
                          />
                        </MenuOptions>
                      </Menu>
                    );
                  } else {
                    return (
                      <Menu>
                        <MenuTrigger>
                          <Icon
                            name="dots-three-horizontal"
                            type="entypo"
                            color="white"
                            size={10}
                            containerStyle={{ padding: 3 }}
                          />
                        </MenuTrigger>
                        <MenuOptions>
                          <MenuOption
                            fontSize={15}
                            color="#38B3FE"
                            onSelect={() => viewProfile(item.sentBy)}
                            text="View Profile"
                          />
                        </MenuOptions>
                      </Menu>
                    );
                  }
                })()}
              </View>
            </View>
          </View>
        );
      }
    } else {
      return null;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <MenuProvider>
        <Header
          containerStyle={{
            backgroundColor: "#38B3FE",
          }}
          centerComponent={{
            text: route.params.item.CHATDETAILS.groupName,
            style: {
              color: "#fff",

              fontSize: 15,
              fontWeight: "bold",
            },
          }}
          leftComponent={{
            onPress: () => navigation.navigate("HomepageScreen"),
            icon: "arrow-back",
            iconStyle: { color: "#fff" },
            style: {
              margin: 10,
            },
          }}
          rightComponent={
            <Menu>
              <MenuTrigger>
                <Icon
                  name="dots-three-vertical"
                  type="entypo"
                  color="white"
                  size={20}
                  containerStyle={{ padding: 3 }}
                />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption
                  fontSize={15}
                  color="#38B3FE"
                  onSelect={() =>
                    navigation.navigate("ViewParticipant", { item })
                  }
                  style={{
                    margin: 5,
                    borderWidth: 1,
                    borderRadius: 100,
                    borderColor: "#707070",
                    alignItems: "center",
                  }}
                  text={global.textViewParticipants}
                />
                {(() => {
                  if (
                    route.params.item.CHATDETAILS.createdby === currentUser.uid
                  ) {
                    return (
                      <MenuOption
                        fontSize={15}
                        color="#38B3FE"
                        onSelect={() =>
                          navigation.navigate("AddParticipantScreen", { item })
                        }
                        style={{
                          margin: 5,
                          borderWidth: 1,
                          borderRadius: 100,
                          borderColor: "#707070",
                          alignItems: "center",
                        }}
                        text={global.textInviteParticipants}
                      />
                    );
                  } else {
                    return null;
                  }
                })()}
              </MenuOptions>
            </Menu>
          }
        />

        <FlatList
          data={messageArray.sort(function (a, b) {
            moment(a.messageDateAndTime).diff(moment(b.messageDateAndTime));
          })}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => itemToRender(item)}
          style={{
            height: "100%",
            backgroundColor: "#fff",
            marginBottom: 50,
          }}
        />
        <Button
          title={global.textWriteAMessage}
          type="clear"
          disabled={
            route.params.item.CHATDETAILS.status !== "Allow" &&
            route.params.item.CHATDETAILS.createdby !== currentUser.uid
              ? true
              : false
          }
          titleStyle={{ fontSize: 15, color: "#707070" }}
          buttonStyle={styles.ButtonStyle}
          onPress={async () => {
            var item = route.params.item;
            const getLastMessageSent = await firebase
              .database()
              .ref("chatsMessages/" + route.params.item.CHATDETAILS.key);
            getLastMessageSent.off("value");
            navigation.navigate("NewMessageScreen", { item });
          }}
        />

        <Overlay
          isVisible={visible}
          onBackdropPress={toggleOverlay}
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
            {global.textDeleteMessage}
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
              }}
              title={global.textCancel}
              titleStyle={{ marginLeft: 5, color: "#707070", fontSize: 15 }}
              onPress={() => {
                toggleOverlay();
              }}
            />

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
              title={global.textDelete}
              titleStyle={{
                marginLeft: 5,
                color: "#fff",
                fontSize: 15,
              }}
              onPress={() => {
                deleteMessage(messageToDelete);
                toggleOverlay();
              }}
            />
          </View>
        </Overlay>

        <Overlay
          isVisible={kickVisible}
          onBackdropPress={toggleKickOverly}
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
            {global.textConfirmRemove}
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
              }}
              title={global.textCancel}
              titleStyle={{ marginLeft: 5, color: "#707070", fontSize: 15 }}
              onPress={() => {
                toggleKickOverly();
              }}
            />

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
              title={global.textKick.toUpperCase()}
              titleStyle={{
                marginLeft: 5,
                color: "#fff",
                fontSize: 15,
              }}
              onPress={() => {
                kickUser(userToKick);
                toggleKickOverly();
              }}
            />
          </View>
        </Overlay>
      </MenuProvider>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  ButtonStyle: {
    height: 50,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#707070",
    width: "90%",
    borderRadius: 100,
    alignSelf: "center",
  },
  chatContainer: {
    backgroundColor: "#fff",
    padding: 10,
  },
  userChatConatiner: {
    padding: 10,
    flexDirection: "row-reverse",
  },
  userMessageContainer: {
    padding: 10,
    flexDirection: "row-reverse",
    backgroundColor: "#2F7FEB",
    borderRadius: 20,
    maxWidth: "85%",
  },
  userTextStyle: {
    fontSize: 15,
    color: "#fff",
  },
  userTimeStyle: {
    fontSize: 10,
    alignSelf: "center",
  },
  senderChatConatiner: {
    padding: 10,
    flexDirection: "row",
  },
  senderMessageContainer: {
    flexDirection: "row",
    backgroundColor: "#B9B9B9",
    borderRadius: 20,
    padding: 10,
    maxWidth: "80%",
  },
  senderTextStyle: {
    fontSize: global.fontTextSize,
    flexWrap: "wrap",
    color: "#000",
  },
  senderTimeStyle: {
    fontSize: 10,
    alignSelf: "center",
    marginLeft: 20,
  },
});

export default SendMessageScreen;
