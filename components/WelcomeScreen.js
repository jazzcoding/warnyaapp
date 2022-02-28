import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";
import "../attribute/global";
const Welcome = ({ navigation }) => {
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  return (
    <ScrollView>
      <View
        style={[styles.container, { height: windowHeight, width: windowWidth }]}
      >
        <Text style={[styles.TextStyle, { fontSize: 18 }]}>
          {global.welcomeTitle}
        </Text>
        <Text
          style={[
            styles.TextStyle,
            {
              fontSize: 15,
              textAlign: "center",
              marginLeft: 50,
              marginRight: 50,
            },
          ]}
        >
          {global.welcomeMessage}
        </Text>
        <Image
          source={require("../assets/phoneicon.jpeg")}
          style={{
            width: "100%",
            height: "50%",
          }}
          resizeMode="contain"
        />
        <Button
          title="START"
          type="clear"
          titleStyle={{ fontSize: 18, fontWeight: "bold" }}
          containerStyle={[styles.ButtonStyle, { width: "60%" }]}
          onPress={() => navigation.navigate("SignupScreen")}
        />
        <Text style={[styles.TextStyle, { fontSize: 12 }]}>
          Already a member?
        </Text>
        <Text
          style={[styles.TextStyle, { fontSize: 18, fontWeight: "bold" }]}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          Sign in
        </Text>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#38B3FE",
    flex: 1,
    paddingTop: 100,
    alignContent: "center",
    alignItems: "center",
  },

  ButtonStyle: {
    alignSelf: "center",
    borderRadius: 100,
    alignContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#707070",
  },

  TextStyle: {
    padding: 10,
    color: "#fff",
  },
});
export default Welcome;
