import React from "react";
import { Button, Card, Avatar, Header, Input } from "react-native-elements";
import { View, Text, TextInput, StyleSheet, Image, Alert } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import "../../db/global";
import "../../attribute/global";
import LoadingPage from "../../attribute/LoadingPage";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import { useIsFocused } from "@react-navigation/core";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
const NewMessageScreen = ({ route, navigation }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [photo, setPhoto] = React.useState("");
  const [warningPhoto, setWarningPhoto] = React.useState("");
  const [warning, setWarning] = React.useState("");
  const [warningText, setWarningText] = React.useState("");
  const [date, setdate] = React.useState(
    moment().add(1, "d").format("MM/DD/YY")
  );
  const [time, setTime] = React.useState(moment().format("HH:mm"));
  const [isLoading, setIsLoading] = React.useState(true);
  const currentUser = firebase.auth().currentUser;
  const isFocused = useIsFocused();
  const [groupName, setGroupName] = React.useState("");
  const [licenseClass, setLicenseClass] = React.useState([]);

  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setGroupName(route.params.item.CHATDETAILS.groupName);
      setIsLoading(false);
    }, 1000);
  }, [isFocused]);

  const handleConfirm = async (date) => {
    setdate(moment(date).format("MM/DD/YY HH:mm:ss").substring(0, 9));
    //console.log(JSON.stringify(date).substring(1, 11));
    hideDatePicker();
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm1 = async (time) => {
    setTime(moment(time).format("MM/DD/YY HH:mm:ss").substring(9, 14));
    hideTimePicker();
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const uploadNewMessage = async (messagedata, photo, warning) => {
    if (warning === "") {
      Alert.alert(global.alertErrorTitle, global.textPleaseSelectWarning, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else if (message.trim() === "") {
      Alert.alert(global.alertErrorTitle, global.textPleaseEnterAYourMessage, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else if (date == "MM/DD/YY" || time == "00:00") {
      Alert.alert(global.alertErrorTitle, global.textPleaseEnterValidTime, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else {
      setIsLoading(true);
      var chatMessageKey = firebase.database().ref().push().getKey();
      const sentdate = moment().format("MM/DD/YYYY HH:mm");
      try {
        const addchatsMessages = firebase
          .database()
          .ref(
            "chatsMessages/" +
              route.params.item.CHATDETAILS.key +
              "/" +
              chatMessageKey
          );
        if (moment(sentdate).isAfter(moment(date + "" + time))) {
          Alert.alert(global.alertErrorTitle, global.textPleaseEnterValidTime, [
            { text: "Ok", onPress: () => console.log("No") },
          ]);
          setIsLoading(false);
        } else {
          addchatsMessages.set({
            message: messagedata,
            messageDateAndTime: sentdate,
            sentBy: currentUser.uid,
            type: "alert",
            warningPhoto: warningPhoto,
            date: date,
            time: time,
          });
          const updateChatDetails = firebase
            .database()
            .ref("chatDetails/" + route.params.item.CHATDETAILS.key);
          updateChatDetails.update({
            lastMessageSent: messagedata,
            messageDateAndTime: sentdate,
            seenby: "",
          });

          const getMembers = firebase
            .database()
            .ref(
              "chatDetails/" + route.params.item.CHATDETAILS.key + "/members"
            );
          if (warning === "red") {
            getMembers.once("value", (snapshot) => {
              snapshot.forEach((element) => {
                const getuserToken = firebase
                  .database()
                  .ref("users/" + element.val().id);
                getuserToken.once("value", (myToken) => {
                  console.log(myToken.val().token);
                  sendNotification(
                    myToken.val().token,
                    myToken.val().type,
                    messagedata,
                    route.params.item.CHATDETAILS.groupName
                  );
                });
              });
            });
          }
          setIsLoading(false);
          Alert.alert(global.alertSuccessTitle, global.textSuccessSentMessage, [
            {
              text: "Ok",
              onPress: () => {
                let item = route.params.item;
                navigation.navigate("HomepageScreen");
              },
            },
          ]);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const sendNotification = async (token, type, messagedata, messageTitle) => {
    if (type === "android") {
      const message = {
        to: token,
        priority: "high",
        data: {
          experienceId: "@breezycoding/warnya",
          title: messageTitle,
          message: messagedata,
          sound: true,
          vibrate: true,
          icon: "https://firebasestorage.googleapis.com/v0/b/warn-ya-58062.appspot.com/o/icon.png?alt=media&token=7443fcf1-a6db-4f9c-afc6-69a717edc31e",
        },
      };

      const FIREBASE_API_KEY =
        "AAAAdyMd82A:APA91bHmuRlZcTRMHmAoZ4HJHKUWxzI-CmegoZgFHifk-tlOtxhgGwh_O3mF7Gq4oXzRH9UUyM-pnSxYUoAYdY3kF-HKGTU8PW6PoErhYqKJPM3ya_FJU9f4Pu_xLBUjXi6hetSBVZNI";
      try {
        let headers = new Headers({
          Authorization: "key=" + FIREBASE_API_KEY,
          "Content-Type": "application/json",
        });
        let response = await fetch("https://fcm.googleapis.com/fcm/send", {
          method: "POST",
          headers,
          body: JSON.stringify(message),
        });
        response = await response.json();
        console.log("response ", response);
      } catch (error) {
        console.log("error ", error);
      }
    } else {
      const message = {
        to: token,
        sound: "default",
        title: messageTitle,
        body: messagedata,
      };

      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    }
  };
  const white = () => {
    setWarning("white");
    setWarningText(global.textForSemiImportantMessage);
    setWarningPhoto(
      "https://firebasestorage.googleapis.com/v0/b/warn-ya-58062.appspot.com/o/yellow.png?alt=media&token=7bd84a15-8b10-4f93-b147-a4eba0e70399"
    );
  };

  const green = () => {
    setWarning("green");
    setWarningText(global.textForUnImportantMessage);
    setWarningPhoto(
      "https://firebasestorage.googleapis.com/v0/b/warn-ya-58062.appspot.com/o/green.png?alt=media&token=0c7af469-07e1-4553-a695-67e1410eeda2"
    );
  };

  const red = () => {
    setWarning("red");
    setWarningText(global.textForImportantMessage);
    setWarningPhoto(
      "https://firebasestorage.googleapis.com/v0/b/warn-ya-58062.appspot.com/o/red.png?alt=media&token=bc79403a-5811-4401-8ce6-803d48d9d830"
    );
  };

  if (isLoading === true) {
    return <LoadingPage />;
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Header
          placement="left"
          containerStyle={{
            backgroundColor: "#38B3FE",
          }}
          leftComponent={{
            icon: "arrow-back",
            color: "#fff",
            onPress: () => {
              navigation.goBack();
            },
          }}
          centerComponent={{
            text: global.textFastMessage,
            style: { color: "#fff", fontWeight: "bold", fontSize: 15 },
          }}
        />
        <Text
          style={[
            styles.TextStyle,
            { fontSize: 15, fontWeight: "bold", color: "#707070" },
          ]}
        >
          {global.textSelectAgroup}
        </Text>
        <Text style={{ alignSelf: "center" }}>{groupName}</Text>
        <Text
          style={[
            styles.TextStyle,
            { fontSize: 15, fontWeight: "bold", color: "#707070" },
          ]}
        >
          {global.textWarningLevel}
        </Text>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <TouchableOpacity
            style={
              warning == "white"
                ? { borderWidth: 1, borderColor: "#38B3FE" }
                : { borderWidth: 0 }
            }
            onPress={() => {
              white();
            }}
          >
            <Image
              source={require("../../assets/white.png")}
              style={{ height: 30, width: 30, margin: 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={
              warning == "green"
                ? { borderWidth: 1, borderColor: "#38B3FE" }
                : { borderWidth: 0 }
            }
            onPress={() => {
              green();
            }}
          >
            <Image
              source={require("../../assets/green.png")}
              style={{ height: 30, width: 30, margin: 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={
              warning === "red"
                ? { borderWidth: 1, borderColor: "#38B3FE" }
                : { borderWidth: 0 }
            }
            onPress={() => {
              red();
            }}
          >
            <Image
              source={require("../../assets/red.png")}
              style={{ height: 30, width: 30, margin: 5 }}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 12,
            color: "#707070",
            alignSelf: "center",
            marginTop: 5,
          }}
        >
          {warningText}
        </Text>
        <Text
          style={[
            styles.TextStyle,
            { fontSize: 15, fontWeight: "bold", color: "#707070" },
          ]}
        >
          {global.textMessage}
        </Text>
        <TextInput
          style={[
            styles.inputContainerStyle,
            {
              borderRadius: 20,
              height: "15%",
              textAlignVertical: "top",
              padding: 10,
            },
          ]}
          placeholder={global.textTypeAMessage}
          multiline={true}
          numberOfLines={4}
          maxLength={80}
          onChangeText={(value) => setMessage(value)}
        />

        <DateTimePicker
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <DateTimePicker
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirm1}
          onCancel={hideTimePicker}
        />
        <Text
          style={[
            styles.TextStyle,
            { fontSize: 15, fontWeight: "bold", color: "#707070" },
          ]}
        >
          {global.textDuration}
        </Text>
        <Text style={[styles.TextStyle, { fontSize: 15, color: "#707070" }]}>
          {global.textDurationMessage}
        </Text>
        <View style={{ flexDirection: "row", margin: 20 }}>
          <Button
            type="clear"
            containerStyle={{
              padding: 5,
              width: "50%",
              borderWidth: 0.5,
              borderTopLeftRadius: 100,
              borderBottomLeftRadius: 100,
              borderColor: "#707070",
            }}
            icon={<Icon name="calendar" size={15} color="#000" />}
            title={date}
            titleStyle={{ marginLeft: 5, color: "#707070", fontSize: 15 }}
            onPress={() => showDatePicker()}
          />

          <Button
            type="clear"
            containerStyle={{
              padding: 5,
              width: "50%",
              borderWidth: 0.5,
              borderTopRightRadius: 100,
              borderBottomRightRadius: 100,
              borderColor: "#707070",
            }}
            icon={<Icon name="clock-o" size={15} color="#000" />}
            title={time}
            titleStyle={{ marginLeft: 5, color: "#707070", fontSize: 15 }}
            onPress={() => showTimePicker()}
          />
        </View>
        <Button
          title={global.textSendNow}
          type="solid"
          buttonStyle={[styles.ButtonStyle, { marginBottom: 100 }]}
          onPress={() => uploadNewMessage(message, photo, warning)}
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
  DropDownPickerStyle: {
    width: "90%",
    zIndex: 0,
    paddingLeft: 10,
    alignSelf: "center",
    borderWidth: 0.5,
    borderColor: "#707070",
    backgroundColor: "#fff",

    borderRadius: 100,
  },

  ButtonStyle: {
    height: 50,
    width: 200,
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
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 0.5,
    padding: 10,
    borderColor: "#707070",
    backgroundColor: "#fff",
  },
  TextStyle: {
    padding: 10,
    width: "100%",
    marginTop: 20,
    textAlign: "center",
  },
});

export default NewMessageScreen;
