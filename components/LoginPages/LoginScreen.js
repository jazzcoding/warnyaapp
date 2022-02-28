import React from "react";
import { Input, Button, Card, CheckBox } from "react-native-elements";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { AuthContext } from "../../attribute/context";
import HeaderDesign from "../../attribute/HeaderDesign";
import { signIn } from "../../db/firebaseAPI";
import LoadingPage from "../../attribute/LoadingPage";
const LoginScreen = ({ navigation }) => {
  const { userSignedIn } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [hideShowPassword, setHideShowPassword] = React.useState(true);
  const [isRememberMeChecked, setIsRememberMeChecked] = React.useState(false);

  if (isLoading === true) {
    return <LoadingPage />;
  }

  const _signIn = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      const req = await signIn(email, password);
      if (req === "success") {
        setIsLoading(false);
        userSignedIn();
      } else {
        setIsLoading(false);
      }
    }, 3000);
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <HeaderDesign />
        <View style={{ padding: 20 }}>
          <Text
            style={[
              styles.TextStyle,
              {
                fontSize: global.fontTitleSize,
                color: global.textBlueColor,
                marginTop: 50,
              },
            ]}
          >
            Sign in
          </Text>

          <Input
            placeholder="Email"
            inputContainerStyle={styles.inputContainerStyle}
            leftIcon={{
              type: "Ionicons",
              name: "person",
              marginLeft: 10,
              marginRight: 10,
              color: global.iconBlueColor,
            }}
            onChangeText={(value) => setEmail(value)}
          />
          <Input
            placeholder="Password"
            inputContainerStyle={styles.inputContainerStyle}
            secureTextEntry={hideShowPassword}
            leftIcon={{
              type: "Fontisto",
              name: "lock",
              marginRight: 10,
              marginLeft: 10,
              color: global.iconGrayColor,
            }}
            onChangeText={(value) => setPassword(value)}
            rightIcon={{
              type: "MaterialIcons",
              name: "remove-red-eye",
              color: hideShowPassword
                ? global.iconGrayColor
                : global.iconBlueColor,
              onPress: () => setHideShowPassword(!hideShowPassword),
            }}
          />
          <View style={styles.FitToText}>
            <CheckBox
              title="Remember me"
              onPress={() => setIsRememberMeChecked(!isRememberMeChecked)}
              checked={isRememberMeChecked}
              containerStyle={{
                borderWidth: 0,
                backgroundColor: "#fff",
                padding: 0,
                marginTop: 0,
              }}
              textStyle={{ color: "#707070", fontWeight: "100" }}
            />

            <Text
              onPress={() => navigation.navigate("ResetPasswordScreen")}
              style={{
                padding: 0,
                fontSize: global.fontTextSize,
                color: global.textBlueColor,
              }}
            >
              Forgot Password?
            </Text>
          </View>
          <Button
            title="LOG IN"
            type="solid"
            buttonStyle={styles.ButtonStyle}
            onPress={() => _signIn()}
          />
          <Text
            style={[
              styles.TextStyle,
              { fontSize: 15, color: global.textGrayColor },
            ]}
          >
            Do you have an account?
          </Text>
          <Text
            onPress={() => navigation.navigate("SignupScreen")}
            style={[
              styles.TextStyle,
              {
                fontSize: 15,
                color: global.textBlueColor,
                fontWeight: "bold",
              },
            ]}
          >
            Sign up from here
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: global.backgroundWhiteColor,
    flex: 1,
  },

  ButtonStyle: {
    backgroundColor: global.buttonBlueColor,
    width: "80%",
    color: global.textWhiteColor,
    height: 50,
    marginTop: 50,
    borderRadius: 100,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#707070",
  },

  inputContainerStyle: {
    elevation: 1,
    borderRadius: 100,
    borderColor: "#707070",
    borderWidth: 1,
    backgroundColor: global.inputWhiteColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
});

export default LoginScreen;
