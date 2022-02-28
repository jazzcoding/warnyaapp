import React from "react";
import { View, Image, Text, Linking } from "react-native";
import { Button, Icon } from "react-native-elements";
import WebView from "react-native-webview";

const webview = React.createRef();

const UpgradeToPro = ({ navigation }) => {
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: "#fff",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          alignSelf: "center",
          padding: 20,
          margin: 30,
          color: "#38B3FE",
        }}
      >
        BENIFITS OF PREMIUM ACCOUNT
      </Text>
      <Image
        source={require("../../assets/sidenavicon/upgradeToPro.png")}
        style={{
          width: 150,
          height: 150,
          marginBottom: 40,
          alignSelf: "center",
        }}
        resizeMode="contain"
      />
      <View style={{ flexDirection: "row", alignSelf: "center", padding: 10 }}>
        <Icon name="circle" color="#517fa4" size={10} />
        <Text style={{ paddingLeft: 5 }}>Ad-free experience </Text>
      </View>
      <View style={{ flexDirection: "row", alignSelf: "center", padding: 10 }}>
        <Icon name="circle" color="#517fa4" size={10} />
        <Text style={{ paddingLeft: 5 }}>Premium support access</Text>
      </View>
      <Text
        style={{
          marginTop: 10,
          paddingEnd: 20,
          paddingBottom: 10,
          paddingTop: 10,
          paddingStart: 20,
          alignSelf: "center",
          backgroundColor: "#2F7FEB",
          color: "#fff",
          borderRadius: 100,
        }}
      >
        Coming soon.
      </Text>
      <Button
        title={global.textBack}
        type="solid"
        titleStyle={{ fontSize: 12, color: "#2F7FEB" }}
        buttonStyle={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#707070",
          minWidth: "90%",
          color: "#fff",
          borderRadius: 100,
          alignSelf: "center",
          margin: 30,
          padding: 15,
        }}
        onPress={() => {
          navigation.navigate("HomepageScreen");
        }}
      />
    </View>
  );
};

export default UpgradeToPro;
