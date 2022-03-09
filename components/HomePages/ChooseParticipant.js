import React from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  Input,
  Text,
  Avatar,
  Icon,
  Button,
  Overlay,
} from "react-native-elements";
import { AuthContext } from "../../attribute/context";
import * as firebase from "firebase";
import "firebase/firestore";
import "../../attribute/global";
import { FlatList } from "react-native";
import LoadingPage from "../../attribute/LoadingPage";
import moment from "moment";
import { AdMobInterstitial } from "expo-ads-admob";
import { TouchableOpacity } from "react-native-gesture-handler";

const ChooseParticipant = ({ route }) => {
  const [users, setUsers] = React.useState([]);
  const [participantList, setParticipantList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searching, setSearching] = React.useState(false);
  const currentUser = firebase.auth().currentUser;
  const { userSignedIn } = React.useContext(AuthContext);
  const [visible, setVisible] = React.useState(false);
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  React.useEffect(() => {}, []);

  const uploadGroupImage = async (path) => {
    setIsLoading(true);
    if (path !== "") {
      try {
        var imagekey = await firebase.database().ref().push().getKey();
        const response = await fetch(path);
        const blob = await response.blob();
        var ref = await firebase
          .storage()
          .ref()
          .child("my-image/" + imagekey);
        ref.put(blob).then((snapshot) => {
          snapshot.ref.getDownloadURL().then((url) => {
            sendNow(url);
          });
        });
      } catch (error) {
        console.log("FAILD TO UPLOAD FILE");
      }
    } else {
      sendNow("");
    }
  };

  const updateSearch = async (value) => {
    try {
      let finalvalue = value.toLowerCase();
      setSearching(true);
      setUsers([]);
      if (value === "") {
        console.log(null);
      } else {
        const getReceiverInfo = await firebase
          .database()
          .ref("users")
          .orderByChild("email")
          .startAt(finalvalue.toLowerCase())
          .endAt(finalvalue.toLowerCase() + "\uf8ff");

        const getReceiverInfoEmail = await firebase
          .database()
          .ref("users")
          .orderByChild("username")
          .startAt(finalvalue)
          .endAt(finalvalue + "\uf8ff");

        getReceiverInfoEmail.on("value", (snapshot) => {
          setSearching(true);
          if (snapshot.exists()) {
            snapshot.forEach((element) => {
              console.log(element.val());
              setUsers(Object.values(snapshot.val()));
              setSearching(false);
            });
          } else {
            getReceiverInfo.on("value", (mysnapshot) => {
              if (mysnapshot.exists())
                mysnapshot.forEach((element) => {
                  console.log(element.val());
                  setUsers(Object.values(mysnapshot.val()));
                });
            });
            setSearching(false);
          }
        });
      }
    } catch (err) {
      Alert.alert(global.alertErrorTitle, global.alertCatch, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    }
  };
  const userExists = (id) => {
    return participantList.some(function (el) {
      return el.id === id;
    });
  };
  const addToListOfParticipant = (id, email, userPicture) => {
    if (userExists(id)) {
      Alert.alert(global.alertErrorTitle, global.textUserAlreadyAdded, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else {
      setParticipantList((oldArray) => [
        ...oldArray,
        { id: id, email: email, userPicture: userPicture },
      ]);
    }
  };
  const sendNow = async (url) => {
    var chatMessageKey = firebase.database().ref().push().getKey();
    var mychatkey = firebase.database().ref().push().getKey();
    var date = moment().format("MM/DD/YYYY HH:mm:ss");
    try {
      const addChatDetails = await firebase
        .database()
        .ref("chatDetails/" + mychatkey);
      addChatDetails.set({
        lastMessageSent: route.params.groupName,
        messageDateAndTime: date,
        groupName: route.params.groupName,
        createdby: currentUser.uid,
        groupImg:
          url === ""
            ? "https://firebasestorage.googleapis.com/v0/b/warn-ya-58062.appspot.com/o/default%20group%20image%20100x100px.png?alt=media&token=78a6ee45-47ed-46de-b388-385770c4a30e"
            : url,
        status: route.params.messageStatus,
        visibility: route.params.visibilityStatus,
        seenby: "",
      });

      participantList.map(async (item) => {
        const addReceiverChats = await firebase
          .database()
          .ref("chatDetails/" + mychatkey + "/members/" + item.id);
        addReceiverChats.set({
          id: item.id,
        });
      });

      const addCreator = await firebase
        .database()
        .ref("chatDetails/" + mychatkey + "/members/" + currentUser.uid);
      addCreator.set({
        id: currentUser.uid,
      });

      const registerGroup = await firebase
        .database()
        .ref("users/" + currentUser.uid + "/group/" + mychatkey);
      registerGroup.update({
        id: mychatkey,
        groupName: route.params.groupName,
        groupImg:
          url === ""
            ? "https://firebasestorage.googleapis.com/v0/b/warn-ya-58062.appspot.com/o/default%20group%20image%20100x100px.png?alt=media&token=78a6ee45-47ed-46de-b388-385770c4a30e"
            : url,
      });

      const addchatsMessages = await firebase
        .database()
        .ref("chatsMessages/" + mychatkey + "/" + chatMessageKey);
      addchatsMessages.set({
        message: route.params.groupName,
        messageDateAndTime: date,
        sentBy: currentUser.uid,
        type: "created",
      });
      const addUserChats = await firebase
        .database()
        .ref("userChats/" + currentUser.uid + "/" + mychatkey);
      addUserChats.set({
        chatUID: mychatkey,
      });
      AccountList(mychatkey);
    } catch (err) {
      alert(err);
      setIsLoading(false);
    }
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
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const AccountList = (mychatkey) => {
    participantList.map(async (item) => {
      const addReceiverChats = await firebase
        .database()
        .ref("userChats/" + item.id + "/" + mychatkey);
      addReceiverChats.set({
        chatUID: mychatkey,
      });
    });
    showAds();
    setIsLoading(false);
    toggleOverlay();
  };

  if (isLoading === true) {
    return <LoadingPage />;
  }
  const itemToRenderParticipant = (item) => {
    return (
      <View>
        <View style={{ flexDirection: "row", padding: 10 }}>
          <Avatar
            rounded
            size={45}
            source={
              item.userPicture
                ? {
                    uri: item.userPicture,
                  }
                : require("../../assets/person.png")
            }
            containerStyle={{ backgroundColor: "#f2f2f2" }}
          />
          <Text
            style={{
              fontSize: global.fontTextSize,
              color: global.textGrayColor,
              padding: 10,
            }}
          >
            {item.email}
          </Text>
        </View>
      </View>
    );
  };

  const itemToRender = (item) => {
    if (item.preferences === "true") {
      return (
        <TouchableOpacity
          onPress={() => {
            addToListOfParticipant(item.id, item.email, item.userPicture);
          }}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 10,
              width: "20%",
              justifyContent: "space-evenly",
            }}
          >
            <Avatar
              rounded
              size={45}
              source={
                item.userPicture
                  ? {
                      uri: item.userPicture,
                    }
                  : require("../../assets/person.png")
              }
              containerStyle={{ backgroundColor: "#fff" }}
            />
            <Text
              style={{
                fontSize: global.fontTextSize,
                color: global.textGrayColor,
              }}
              numberOfLines={1}
            >
              {item.email}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      setUsers([]);
    }
  };
  return (
    <View style={styles.container}>
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
      />
      {(() => {
        if (users.length > 0) {
          return (
            <FlatList
              data={users}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => itemToRender(item)}
              style={{
                backgroundColor: "#fff",
                width: "100%",
                borderBottomWidth: 0.5,
                borderColor: "#707070",
              }}
              // onEndReached={() => {
              // _loadmoreItems();
              // }}
            />
          );
        }
        return <Text style={styles.TextStyle}>{global.textNoUserFound}</Text>;
      })()}

      <FlatList
        data={participantList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => itemToRenderParticipant(item)}
        style={{ padding: 10, height: "55%", backgroundColor: "#fff" }}
        // onEndReached={() => {
        // _loadmoreItems();
        // }}
      ></FlatList>

      <Button
        title={global.textDone}
        type="solid"
        titleStyle={{ fontSize: 15 }}
        buttonStyle={styles.ButtonStyle}
        onPress={() => uploadGroupImage(route.params.groupImg)}
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
          {global.textSuccessCreatedGroup}
        </Text>

        <Button
          type="clear"
          containerStyle={{
            margin: 5,
            width: "50%",
            borderRadius: 100,
            borderWidth: 1,
            borderColor: "#707070",
            backgroundColor: "#2F7FEB",
            alignSelf: "center",
          }}
          title={global.textGoNow}
          titleStyle={{
            marginLeft: 5,
            color: "#fff",
            fontSize: 15,
          }}
          onPress={() => {
            toggleOverlay();
            userSignedIn();
          }}
        />
      </Overlay>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  inputContainerStyle: {
    elevation: 1,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: "#fff",
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

  ButtonStyle: {
    width: "50%",
    color: global.textWhiteColor,
    height: 50,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 50,
    fontWeight: "bold",
    marginBottom: 50,
  },
});

export default ChooseParticipant;
