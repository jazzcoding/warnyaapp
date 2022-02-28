import moment from "moment";
import React from "react";
import "../attribute/global";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import Swipeable from "react-native-gesture-handler/Swipeable";

const SCREEN_WIDTH = Dimensions.get("window").width;

const ItemBox = (props) => {
  const leftSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity onPress={props.handleDelete} activeOpacity={0.6}>
        <View style={styles.deleteBox}>
          <Animated.Text style={{ transform: [{ scale: scale }] }}>
            <Text style={{ color: "#fff" }}>{global.textDelete}</Text>
          </Animated.Text>
          <Animated.Text style={{ transform: [{ scale: scale }] }}>
            <Icon name="delete" color="#fff" />
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };
  //onMessagePress(item)
  return (
    <Swipeable renderLeftActions={leftSwipe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={props.handleViewMessage}>
          <View style={styles.FitToText}>
            <View style={{ marginRight: 5, borderRadius: 20 }}>
              <Image
                source={
                  props.data.CHATDETAILS.groupImg === ""
                    ? require("../assets/groupDefaultImg.png")
                    : {
                        uri: props.data.CHATDETAILS.groupImg,
                        alignSelf: "center",
                      }
                }
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                  marginLeft: 15,
                }}
                PlaceholderContent={
                  <ActivityIndicator style={{ color: "#38B3FE" }} />
                }
              />
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <Text style={styles.GroupNameTextStyle} numberOfLines={1}>
                  {props.data.CHATDETAILS.groupName}
                </Text>
                <Text
                  style={
                    props.data.CHATDETAILS.seen === true
                      ? {
                          backgroundColor: "#2F7FEB",
                          fontWeight: "bold",
                          fontSize: 6,
                          minWidth: 35,
                          padding: 5,
                          borderRadius: 10,
                          alignSelf: "center",
                          textAlign: "center",
                          color: "#fff",
                        }
                      : {
                          backgroundColor: "#4CD038",
                          fontWeight: "bold",
                          fontSize: 6,
                          padding: 5,
                          minWidth: 35,
                          borderRadius: 10,
                          alignSelf: "center",
                          textAlign: "center",
                          color: "#fff",
                        }
                  }
                  numberOfLines={1}
                >
                  {props.data.CHATDETAILS.seen === true
                    ? global.read.toUpperCase()
                    : global.unread.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.MessageTextStyle} numberOfLines={1}>
                {props.data.CHATDETAILS.lastMessageSent}
              </Text>
            </View>
            <Text style={styles.TimeTextStyle}>
              {moment(props.data.CHATDETAILS.messageDateAndTime).fromNow()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

export default ItemBox;

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: SCREEN_WIDTH,
    backgroundColor: "white",
    justifyContent: "center",
  },
  deleteBox: {
    backgroundColor: "#E9082E",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 75,
    borderRadius: 20,
    margin: 5,
    flexDirection: "column-reverse",
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
    maxWidth: "75%",
  },
  TimeTextStyle: {
    color: "#29323A",
    fontSize: 10,
    marginLeft: 10,
    marginRight: 10,
    position: "absolute",
    right: 0,
    top: 0,
    margin: 15,
  },
  FitToText: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: "red",
    borderBottomColor: "#e2e2e2",
    borderBottomWidth: 3,
  },
});
