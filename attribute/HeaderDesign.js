import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Card, Avatar } from "react-native-elements";

const HeaderDesign = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/headerback.png")}
        resizeMode="stretch"
        style={{
          width: "110%",
          position: "absolute",
          height: 200,
          marginTop: -100,
        }}
      ></Image>
      <View
        style={{
          backgroundColor: "#fff",
          padding: 5,
          position: "absolute",
          height: 100,
          width: 100,
          top: 35,
          borderRadius: 100,
          position: "absolute",
        }}
      />
      <Image
        source={require("../assets/Warnyaicon.png")}
        resizeMode="cover"
        style={{
          width: 90,
          height: 90,
          borderRadius: 100,
          borderColor: "#fff",
          marginTop: 40,
        }}
      ></Image>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    alignItems: "center",
  },
});
export default HeaderDesign;
