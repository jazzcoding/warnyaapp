import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Card, Avatar } from "react-native-elements";

const headerHomeDesign = () => {
  return (
    <View style={styles.container}>
      <View style={styles.HeaderContainer}></View>
      <View
        style={{
          backgroundColor: "#fff",
          position: "absolute",
          height: 100,
          width: 100,
          top: 0,
          borderRadius: 100,
          position: "absolute",
        }}
      />
      <Image
        source={require("../assets/Warnyaicon.png")}
        resizeMode="cover"
        style={{
          width: 80,
          height: 80,
          borderRadius: 100,
          borderColor: "#fff",
          marginTop: 10,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    alignItems: "center",
  },

  HeaderContainer: {
    backgroundColor: global.backgroundBlueColor,
    height: 50,
    width: "100%",
    position: "absolute",
  },
});
export default headerHomeDesign;
