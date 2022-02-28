import React from "react";
import { Input, Button, Card } from "react-native-elements";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../../attribute/context";
import HeaderDesign from "../../attribute/HeaderDesign";
import * as firebase from "firebase";
import "firebase/firestore";
import LoadingPage from "../../attribute/LoadingPage";
AuthContext;
const ResetPasswordScreen = () => {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const forgotPassword = (Email) => {
    if (Email.trim() !== "") {
      firebase
        .auth()
        .sendPasswordResetEmail(Email)
        .then(function (user) {
          console.log(user);
          Alert.alert(
            "Reset password",
            "We have successfully sent you a reset password assistance to your email.",
            [{ text: "Ok", onPress: () => console.log("No") }]
          );
        })
        .catch(function (e) {
          alert(e.message);
        });
    } else {
      Alert.alert("ERROR", "Please enter your email address", [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    }
  };
  if (isLoading === true) {
    return <LoadingPage />;
  }
  return (
    <View style={styles.container}>
      <HeaderDesign />

      <Text
        style={[
          styles.TextStyle,
          { fontSize: global.fontTitleSize, color: global.textBlueColor },
        ]}
      >
        Reset Password
      </Text>

      <Text
        style={[
          styles.TextStyle,
          { fontSize: global.fontTextSize, color: global.textGrayColor },
        ]}
      >
        {global.resetPasswordMessage}
      </Text>

      <Input
        placeholder="Enter your email"
        inputContainerStyle={styles.inputContainerStyle}
        leftIcon={{
          type: "Fontisto",
          name: "email",
          marginLeft: 10,
          marginRight: 10,
          color: global.iconBlueColor,
        }}
        onChangeText={(value) => setEmail(value)}
      />

      <Button
        title="SUBMIT"
        type="solid"
        buttonStyle={styles.ButtonStyle}
        onPress={() => forgotPassword(email)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: global.backgroundWhiteColor,
    flex: 1,
  },

  ButtonStyle: {
    backgroundColor: global.buttonBlueColor,
    width: "50%",
    color: global.textWhiteColor,
    height: 50,
    borderRadius: 100,
    alignSelf: "center",
  },
  FormContainer: {
    margin: 0,
    borderWidth: 0,
    elevation: 0,
  },

  inputContainerStyle: {
    elevation: 1,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: global.inputWhiteColor,
  },
  TextStyle: {
    padding: 10,
    width: "100%",
    textAlign: "center",
  },
});

export default ResetPasswordScreen;
