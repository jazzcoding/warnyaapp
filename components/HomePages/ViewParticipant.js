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
import "../../attribute/global";
import { Avatar, Button, Header, Image } from "react-native-elements";
import { useIsFocused } from "@react-navigation/core";
import LoadingPage from "../../attribute/LoadingPage";
const ViewParticipant = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const [users, setUsers] = React.useState([]);
  const [item, setItem] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const currentUser = firebase.auth().currentUser;
  React.useEffect(() => {
    setItem(route.params.item);
    viewUser(route.params.item.CHATDETAILS.key);
  }, [isFocused]);
  const viewUser = async (key) => {
    let members = [];
    try {
      const getParticipantDetails = await firebase
        .database()
        .ref("chatDetails/" + key + "/members");
      getParticipantDetails.once("value", (snapshot) => {
        snapshot.forEach(function (element) {
          const data = element.val().id;
          members.push({ data });
        });
        mapUser(members);
      });
    } catch (err) {
      setIsLoading(false);
      alert(err);
    }
  };
  const itemToRender = (item) => {
    return (
      <View style={styles.chatMessage}>
        <Avatar
          rounded
          source={
            item.data.userPicture
              ? {
                  uri: item.data.userPicture,
                }
              : require("../../assets/person.png")
          }
          containerStyle={{
            width: 40,
            height: 40,
            borderRadius: 100,
            backgroundColor: "#f2f2f2",
          }}
          PlaceholderContent={<ActivityIndicator />}
        />
        <Text style={styles.TextStyle}>{item.data.email}</Text>

        {(() => {
          if (route.params.item.CHATDETAILS.createdby === currentUser.uid) {
            return (
              <Button
                title={item.data.id === currentUser.uid ? "Admin" : "Remove"}
                type="solid"
                iconPosition="right"
                buttonStyle={styles.ButtonStyle}
                onPress={() =>
                  removeUserAlert(
                    route.params.item.CHATDETAILS.key,
                    item.data.id
                  )
                }
                disabled={item.data.id === currentUser.uid ? true : false}
                titleStyle={{ fontSize: 10 }}
              />
            );
          } else {
            return null;
          }
        })()}
      </View>
    );
  };
  const mapUser = async (arrayKey) => {
    try {
      setUsers([]);
      arrayKey.map(async (item) => {
        const getUserdetails = firebase.database().ref("users/" + item.data);
        getUserdetails.once("value", async (snapshot) => {
          const data = snapshot.val();
          setUsers((oldArray) => [...oldArray, { data }]);
          console.log(users);
        });
      });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const removeUserAlert = (key, member) => {
    Alert.alert(global.textAlert, global.textConfirmRemove, [
      {
        text: global.textRemove,
        onPress: () => {
          removeUser(key, member);
        },
      },
      {
        text: global.textCancel,
        onPress: () => {
          console.log("No");
        },
      },
    ]);
  };

  const removeUser = async (key, member) => {
    try {
      const getMemberID = await firebase
        .database()
        .ref("chatDetails/" + key + "/members")
        .orderByChild("id")
        .startAt(member)
        .endAt(member);
      getMemberID.once("value", (snapshot) => {
        snapshot.forEach(async (element) => {
          const removeMember = await firebase
            .database()
            .ref("chatDetails/" + key + "/members/" + element.key);
          removeMember.remove();
          const removeMessage = await firebase
            .database()
            .ref("userChats/" + element.val().id + "/" + key);
          removeMessage.remove();
          viewUser(route.params.item.CHATDETAILS.key);
          setIsLoading(false);
        });
      });
    } catch (err) {
      Alert.alert(global.textAlert, global.alertCatch, [
        {
          text: global.ok,
          onPress: () => {
            console.log;
          },
        },
      ]);
    }
  };
  if (isLoading === true) {
    <LoadingPage />;
  }
  return (
    <View style={styles.container}>
      <Header
        placement="left"
        containerStyle={{
          backgroundColor: "#38B3FE",
        }}
        centerComponent={{
          text: global.textParticipants,
          style: { color: "#fff", fontSize: 15, fontWeight: "bold" },
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
      <FlatList
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => itemToRender(item)}
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#f2f2f2",
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
  },
  chatMessage: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  TextStyle: {
    textAlign: "center",
    color: "black",
    fontSize: 12,
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
});

export default ViewParticipant;
