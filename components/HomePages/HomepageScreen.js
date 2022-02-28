import React from "react";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  Text,
  View,
  Platform,
  Dimensions,
  Permission,
} from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {
  SpeedDial,
  Image,
  Button,
  Icon,
  Header,
  Overlay,
} from "react-native-elements";
import HeaderHomeDesign from "../../attribute/HeaderHomeDesign";
import { AuthContext } from "../../attribute/context";
import "../../attribute/global";
import * as firebase from "firebase";
import "firebase/firestore";
import "../../db/global";
import LoadingPage from "../../attribute/LoadingPage";
import ItemBox from "../../HelperClass/itembox";
import { useIsFocused } from "@react-navigation/core";
import moment from "moment";
import { AdMobBanner, AdMobInterstitial } from "expo-ads-admob";
import "moment/locale/it";
import "moment/locale/de";
import "moment/locale/nl";
import "moment/locale/en-ca";
import "moment/locale/fr";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import EmailVerificationScreen from "./EmailVerificationScreen";
const HomepageScreen = ({ navigation }) => {
  const { userCreateGroup } = React.useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [chat, setChat] = React.useState([]);
  const currentUser = firebase.auth().currentUser;
  const isFocused = useIsFocused();
  const [sorting, setSorting] = React.useState("");
  const [addBanner, setAddBanner] = React.useState("");
  const [item, setItem] = React.useState("");
  const [index, setIndex] = React.useState("");
  const [emailVerified, setEmailVerified] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;

  var chatdetails = [];
  React.useEffect(() => {
    getUserLanguage();
    if (Platform.OS === "ios") {
      setAddBanner("ca-app-pub-5356140400244515~2938550185");
      // Display an interstitial
    } else {
      setAddBanner("ca-app-pub-5356140400244515/5596758332");
    }

    // showAds();

    //setIsLoading(true);
    setTimeout(() => {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user.emailVerified) {
          setEmailVerified("verified");
          registerForPushNotification();
          const getChatsMessages = firebase
            .database()
            .ref("userChats/" + currentUser.uid)
            .on("value", (chats) => {
              let retreiveuserchats = [];
              chatdetails = [];
              if (chats.exists()) {
                chats.forEach(function (element) {
                  retreiveuserchats.push({ id: element.val().chatUID });
                });
                getchatdetails(retreiveuserchats);
              } // else {
              //  setIsLoading(false);
              // }
            });
          return () =>
            firebase
              .database()
              .ref("userChats/" + currentUser.uid)
              .off("value", getChatsMessages);
        } else {
          //setIsLoading(false);
          await user.sendEmailVerification();
          setEmailVerified("notverified");
        }
      });
    }, 1000);
  }, [isFocused]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const getUserLanguage = async () => {
    try {
      const contactExist = await firebase
        .database()
        .ref("users/" + currentUser.uid)
        .orderByChild("chatUID");
      contactExist.once("value").then((snapshot) => {
        if (snapshot.exists()) {
          if (snapshot.val().language === "English") {
            moment.locale("en-ca");
          } else if (snapshot.val().language === "German") {
            moment.locale("de");
          } else if (snapshot.val().language === "Dutch") {
            moment.locale("nl");
          } else if (snapshot.val().language === "Italian") {
            moment.locale("it");
          } else if (snapshot.val().language === "French") {
            moment.locale("fr");
          }
        } else {
          console.log("File does not exist");
        }
      });
    } catch (err) {
      Alert.alert(global.alertErrorTitle, `${global.alertCatch}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    }
  };

  const registerForPushNotification = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      const token =
        Platform.OS === "android"
          ? (await Notifications.getDevicePushTokenAsync()).data
          : (await Notifications.getExpoPushTokenAsync()).data;
      const type = (await Notifications.getDevicePushTokenAsync()).type;

      await firebase
        .database()
        .ref("users/" + currentUser.uid)
        .update({ token, type });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };
  function chatExist(key) {
    return chatdetails.some(function (el) {
      return el.CHATDETAILS.key === key;
    });
  }
  if (emailVerified === "notverified") {
    return <EmailVerificationScreen />;
  }

  const getchatdetails = (retreiveuserchats) => {
    try {
      let seen;
      retreiveuserchats.map(async (item) => {
        const getChatDetails = await firebase
          .database()
          .ref("chatDetails/" + item.id);
        getChatDetails.on("value", function (snapshot) {
          if (snapshot.exists()) {
            if (chatExist(item.id)) {
              const index = chatdetails.findIndex(
                (item) => item.CHATDETAILS.key === item.id
              );
              chatdetails.splice(index);
              chatdetails.push({
                CHATDETAILS: {
                  createdby: snapshot.val().createdby,
                  groupImg: snapshot.val().groupImg,
                  groupName: snapshot.val().groupName,
                  lastMessageSent: snapshot.val().lastMessageSent,
                  messageDateAndTime: snapshot.val().messageDateAndTime,
                  key: item.id,
                  status: snapshot.val().status,
                  seen: false,
                },
              });
            } else {
              let mydata = [snapshot.val().seenby];
              mydata.some(function (el) {
                if (el.hasOwnProperty(currentUser.uid)) {
                  seen = true;
                } else {
                  seen = false;
                }
              });
              chatdetails.push({
                CHATDETAILS: {
                  createdby: snapshot.val().createdby,
                  groupImg: snapshot.val().groupImg,
                  groupName: snapshot.val().groupName,
                  lastMessageSent: snapshot.val().lastMessageSent,
                  messageDateAndTime: snapshot.val().messageDateAndTime,
                  key: item.id,
                  status: snapshot.val().status,
                  seen,
                },
              });
            }
            setSorting("new");
            chatdetails.sort((a, b) =>
              moment(b.CHATDETAILS.messageDateAndTime).diff(
                moment(a.CHATDETAILS.messageDateAndTime)
              )
            );
            setChat(chatdetails);
            //setIsLoading(false);
          } //else {
          //   setIsLoading(false);
          //}
        });
      });
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading == true) {
    return <LoadingPage />;
  }

  const onMessagePress = async (item) => {
    try {
      const currentUser = await firebase.auth().currentUser;
      const seenMessage = firebase
        .database()
        .ref(
          "chatDetails/" + item.CHATDETAILS.key + "/seenby/" + currentUser.uid
        );
      if (item.CHATDETAILS.key !== null) {
        seenMessage.update({ id: currentUser.uid });
        navigation.navigate("SendMessageScreen", { item });
      } else {
        console.log("no data found");
      }
    } catch (err) {
      alert(err.message);
    }
  };
  const deleteItem = async (item, index) => {
    const removeUserChats = await firebase.database().ref("userChats");

    const removeChatMessages = await firebase
      .database()
      .ref("chatsMessages/" + item.CHATDETAILS.key);

    const removechatDetails = await firebase
      .database()
      .ref("chatDetails/" + item.CHATDETAILS.key);

    const removeGroup = await firebase
      .database()
      .ref("users/" + currentUser.uid + "/group/" + item.CHATDETAILS.key);

    const leftGroup = await firebase
      .database()
      .ref(
        "chatDetails/" + item.CHATDETAILS.key + "/members/" + currentUser.uid
      );

    try {
      // setIsLoading(true);
      if (currentUser.uid === item.CHATDETAILS.createdby) {
        removeUserChats.once("value", (datasnapshot) => {
          datasnapshot.forEach((child) => {
            const removeUserChat = firebase
              .database()
              .ref("userChats/" + child.key + "/" + item.CHATDETAILS.key);
            removeUserChat.remove();
          });
        });
        removechatDetails.remove();
        removeChatMessages.remove();
        removeGroup.remove();
        const arr = [...chat];
        arr.splice(index, 1);
        setChat(arr);
      } else {
        removeUserChats.remove();
        leftGroup.remove();
        const arr = [...chat];
        arr.splice(index, 1);
        setChat(arr);
      }
      //setIsLoading(false);
    } catch (err) {
      console.log(err.message);
      //setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <MenuProvider>
        <Header
          containerStyle={{
            backgroundColor: "#38B3FE",
            elevation: 0,
            borderBottomWidth: 0,
          }}
          leftComponent={{
            onPress: () => navigation.openDrawer(),
            icon: "menu",
            iconStyle: { color: "#fff" },
            style: {
              margin: 10,
            },
          }}
          rightComponent={
            <Menu>
              <MenuTrigger
                style={{
                  backgroundColor: "#38B3FE",
                }}
              >
                <Icon
                  name="dots-three-vertical"
                  type="entypo"
                  color="#fff"
                  size={20}
                  containerStyle={{ alignSelf: "flex-end" }}
                />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption
                  fontSize={15}
                  color="#38B3FE"
                  onSelect={() => setSorting("new")}
                  text={global.newestFirst}
                />
                <MenuOption
                  fontSize={15}
                  color="#38B3FE"
                  onSelect={() => setSorting("old")}
                  text={global.oldestFirst}
                />
              </MenuOptions>
            </Menu>
          }
        />

        <HeaderHomeDesign />
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 5,
            borderBottomWidth: 2,
            borderColor: "#f2f2f2",
          }}
        >
          <Text
            style={{
              marginLeft: 10,
              width: "100%",
              alignSelf: "center",
              color: "#194A76",
              fontWeight: "bold",
              flexShrink: 2,
              textAlign: "center",
              flexWrap: "nowrap",
            }}
            numberOfLines={1}
          >
            {global.searchText.toUpperCase()}
          </Text>
          <Button
            title={global.typeAgroupNameorScanQR}
            type="clear"
            icon={{
              type: "Fontisto",
              name: "search",
              color: global.iconGrayColor,
              padding: 5,
              alignContent: "flex-start",
            }}
            titleStyle={{
              fontSize: 10,
              width: "90%",
              textAlign: "left",
              color: "#707070",
            }}
            containerStyle={[
              styles.inputContainerStyle,
              {
                alignContent: "flex-start",
                width: global.searchText === "Rechercher" ? "55%" : "65%",
                height: 45,
              },
            ]}
            onPress={() => {
              navigation.navigate("SearchGroupScreen");
            }}
          />
          <Icon
            name="qrcode"
            type="fontisto"
            color="#38B3FE"
            size={20}
            containerStyle={{ alignSelf: "center", marginRight: 20 }}
            onPress={() => {
              navigation.navigate("QRCodeScanner");
            }}
          />
        </View>
        <FlatList
          data={
            sorting === "old"
              ? chat.sort((a, b) =>
                  moment(a.CHATDETAILS.messageDateAndTime).diff(
                    moment(b.CHATDETAILS.messageDateAndTime)
                  )
                )
              : chat.sort((a, b) =>
                  moment(b.CHATDETAILS.messageDateAndTime).diff(
                    moment(a.CHATDETAILS.messageDateAndTime)
                  )
                )
          }
          keyExtractor={(item, index) => "item" + index}
          renderItem={({ item, index }) => {
            return (
              <ItemBox
                data={item}
                handleDelete={async () => {
                  setItem(item);
                  setIndex(index);
                  toggleOverlay();
                }}
                handleViewMessage={() => onMessagePress(item)}
              />
            );
          }}
        />

        <SpeedDial
          isOpen={open}
          icon={{
            name: "add",
            color: "#fff",
          }}
          color={"#2F7FEB"}
          openIcon={{ name: "close", color: "#fff" }}
          onClose={() => setOpen(!open)}
          onOpen={() => {
            setOpen(!open);
          }}
          style={{ marginBottom: 60 }}
        >
          <SpeedDial.Action
            icon={
              <Image
                source={require("../../assets/quick.png")}
                style={{ width: 24, height: 24 }}
              />
            }
            title={global.textFastMessage}
            onPress={() => navigation.navigate("FastMessageScreen")}
            color={"red"}
          ></SpeedDial.Action>
          <SpeedDial.Action
            icon={
              <Image
                source={require("../../assets/add.png")}
                style={{ width: 24, height: 24 }}
              />
            }
            title={global.textCreateGroup}
            color={"#38B3FE"}
            onPress={() => userCreateGroup()}
          />
        </SpeedDial>
        {(() => {
          var now = moment().format("MM/DD/YYYY HH:mm");
          if (moment(global.subscription).isSameOrAfter(moment(now))) {
            return null;
          } else {
            return (
              <AdMobBanner
                bannerSize="banner"
                adUnitID="ca-app-pub-5356140400244515/5596758332"
                servePersonalizedAds={false}
                onDidFailToReceiveAdWithError={(error) => {
                  console.log(error);
                }}
                style={{ alignItems: "center" }}
              />
            );
          }
        })()}
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
              title="CANCEL"
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
              title="DELETE"
              titleStyle={{
                marginLeft: 5,
                color: "#fff",
                fontSize: 15,
              }}
              onPress={() => {
                deleteItem(item, index);
                toggleOverlay();
              }}
            />
          </View>
        </Overlay>
      </MenuProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainerStyle: {
    margin: 10,
    alignContent: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 100,
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#38B3FE",
  },
  MessageTextStyle: {
    textAlign: "left",
    alignItems: "center",
    padding: 10,
    maxWidth: "100%",
  },
  GroupNameTextStyle: {
    fontWeight: "bold",
    color: "#194A76",
    marginLeft: 10,
    marginRight: 10,
    fontSize: 12,
    color: "#000",
    width: "30%",
    maxWidth: "30%",
  },
  TimeTextStyle: {
    color: "#194A76",
    fontSize: 12,
    marginLeft: 10,
    marginRight: 10,
    position: "absolute",
    right: 0,
    top: 0,
    margin: 25,
  },
  FitToText: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    margin: 1,
    alignItems: "center",
    shadowColor: "#470000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    elevation: 5,
  },
});

export default HomepageScreen;
