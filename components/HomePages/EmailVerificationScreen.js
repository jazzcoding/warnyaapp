import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements/dist/icons/Icon";
import HeaderDesign from "../../attribute/HeaderDesign";
import * as firebase from "firebase";
import "firebase/firestore";
import { AuthContext } from "../../attribute/context";

const EmailVerificationScreen = () => {
  const { userLogin } = React.useContext(AuthContext);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderDesign />
      <Text
        style={{
          fontSize: 15,
          fontWeight: "bold",
          color: "#707070",
          alignSelf: "center",
          padding: 20,
        }}
      >
        VERIFY YOUR EMAIL
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "bold",
          color: "#707070",
          textAlign: "center",
          padding: 20,
        }}
      >
        We have sent you an email to verify your email address and activate your
        account.
      </Text>
      <Button
        type="clear"
        containerStyle={{
          padding: 5,
          width: "50%",
          borderWidth: 0.5,
          borderRadius: 100,
          borderColor: "#707070",
          alignSelf: "center",
          position: "absolute",
          bottom: 40,
        }}
        title="Login now"
        titleStyle={{ marginLeft: 5, color: "#707070", fontSize: 15 }}
        onPress={() => {
          firebase.auth().signOut();
          userLogin();
        }}
      />
    </View>
  );
};

export default EmailVerificationScreen;
