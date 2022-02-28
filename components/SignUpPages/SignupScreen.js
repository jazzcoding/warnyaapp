import React from "react";
import { Input, Button, Card, CheckBox, Overlay } from "react-native-elements";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
  Dimensions,
} from "react-native";
import HeaderDesign from "../../attribute/HeaderDesign";
import LoadingPage from "../../attribute/LoadingPage";
import { registration, signIn } from "../../db/firebaseAPI";
import { AuthContext } from "../../attribute/context";
import "../../attribute/global";
const SignupScreen = ({ navigation }) => {
  const windowHeight = Dimensions.get("screen").height;
  const windowWidth = Dimensions.get("screen").width;
  const [visible, setVisible] = React.useState(false);
  const { userSignedUp } = React.useContext(AuthContext);
  const [checkterms, setcheckterms] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const [code, setCode] = React.useState("");
  //hooks
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  //validation
  const [hasEmailError, setHasEmailError] = React.useState(true);
  const [hasPhoneError, setHasPhoneError] = React.useState(true);
  const [hasPasswordError, setHasPasswordError] = React.useState(true);

  const [isLoading, setIsLoading] = React.useState(false);
  const [showOrHidePassword, setShowOrHidePassword] = React.useState(true);
  //reference
  const inputEmail = React.createRef();

  //error Message
  const emailErrorMessage = !hasEmailError
    ? "Please enter valid email address"
    : "";
  const phoneErrorMessage = !hasPhoneError
    ? "Please enter valid phone number"
    : "";
  const passwordErrorMessage = !hasPasswordError
    ? "Your password should contain the following\n -At least 8 characters \n -Uppercase letters \n -Lowercase letters \n -Numbers\n -Symbol"
    : "";

  //regexValidation
  const validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      setEmail(text);
      setHasEmailError(false);
    } else {
      setHasEmailError(true);
      setEmail(text);
    }
  };
  const validateMobile = (text) => {
    const reg = /^[0]?[+0123456789]\d{8,14}$/;
    if (reg.test(text) === false) {
      setPhone(text);
      setHasPhoneError(false);
    } else {
      setPhone(text);
      setHasPhoneError(true);
    }
  };
  const validatePassword = (text) => {
    const reg =
      /^(?=.{8,})[0-9A-Za-z]*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?][0-9a-zA-Z]*$/;
    if (reg.test(text) === false) {
      setPassword(text);
      setHasPasswordError(false);
    } else {
      setPassword(text);
      setHasPasswordError(true);
    }
  };

  const validateForm = () => {
    if (username === "") {
      Alert.alert("ERROR", `${global.userError}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else if (email === "" || hasEmailError === false) {
      Alert.alert("ERROR", `${global.emailError}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else if (phone === "" || hasPhoneError === false) {
      Alert.alert("ERROR", `${global.phoneError}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else if (password === "" || hasPasswordError == false) {
      Alert.alert("ERROR", `${global.passwordError}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else if (checkterms === false) {
      Alert.alert("ERROR", `Please check terms and conditions.`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else {
      _signUp();
    }
  };
  const _signUp = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      const req = await registration(
        email.toLowerCase(),
        password,
        username,
        phone,
        "true"
      );
      if (req === "success") {
        setIsLoading(false);
        userSignedUp();
      } else {
        setIsLoading(false);
      }
    }, 3000);
  };
  if (isLoading === true) {
    return <LoadingPage />;
  }
  return (
    <View style={styles.container}>
      <HeaderDesign />
      <ScrollView>
        <Text
          style={[
            styles.TextStyle,
            { fontSize: global.fontTitleSize, color: global.textBlueColor },
          ]}
        >
          Create Account
        </Text>
        <View style={styles.FormContainer}>
          <Input
            inputContainerStyle={styles.inputContainerStyle}
            placeholder="Username"
            leftIcon={{
              type: "Ionicons",
              name: "person",
              marginLeft: 10,
              marginRight: 10,
              color: global.iconBlueColor,
            }}
            onChangeText={(value) => setUsername(value)}
            maxLength={20}
            value={username}
          />
          <Input
            ref={inputEmail}
            placeholder="Email"
            inputContainerStyle={
              hasEmailError
                ? styles.inputContainerStyle
                : styles.inputContainerErrorStyle
            }
            renderErrorMessage={true}
            errorMessage={emailErrorMessage}
            leftIcon={{
              type: "Fontisto",
              name: "email",
              marginLeft: 10,
              marginRight: 10,
              color: global.iconBlueColor,
            }}
            onChangeText={(value) => validateEmail(value)}
            value={email}
          />
          <Input
            placeholder="Phone Number"
            inputContainerStyle={
              hasPhoneError
                ? styles.inputContainerStyle
                : styles.inputContainerErrorStyle
            }
            renderErrorMessage={true}
            errorMessage={phoneErrorMessage}
            keyboardType="phone-pad"
            leftIcon={{
              type: "Feather",
              name: "phone",
              marginRight: 10,
              marginLeft: 10,
              color: global.iconBlueColor,
            }}
            onChangeText={(value) => validateMobile(value)}
            value={phone}
          />
          <Input
            placeholder="Password"
            secureTextEntry={showOrHidePassword}
            renderErrorMessage={true}
            errorMessage={passwordErrorMessage}
            inputContainerStyle={
              hasPasswordError
                ? styles.inputContainerStyle
                : styles.inputContainerErrorStyle
            }
            value={password}
            leftIcon={{
              type: "Fontisto",
              name: "lock",
              marginRight: 10,
              marginLeft: 10,
              color: global.iconGrayColor,
            }}
            onChangeText={(value) => validatePassword(value)}
            rightIcon={{
              type: "MaterialIcons",
              name: "remove-red-eye",
              color: showOrHidePassword
                ? global.iconGrayColor
                : global.iconBlueColor,
              marginRight: 10,
              marginLeft: 10,
              onPress: () => setShowOrHidePassword(!showOrHidePassword),
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <CheckBox
              center
              title="I agree to the"
              checked={checkterms}
              textStyle={{ color: "#707070", fontWeight: "100" }}
              onPress={() => setcheckterms(!checkterms)}
              containerStyle={{
                borderWidth: 0,
                backgroundColor: "#fff",
                paddingRight: 0,
                marginRight: 0,
              }}
            />
            <Text
              style={[
                styles.TextStyle,
                {
                  fontSize: 15,
                  color: "#2F7FEB",
                  paddingLeft: 0,
                  marginLeft: 0,
                },
              ]}
              onPress={() => {
                Linking.openURL(
                  "https://www.warnya.com/terms-and-conditions"
                ).catch((err) => console.error("Couldn't load page", err));
              }}
            >
              Terms and Condittions
            </Text>
          </View>
          <Button
            title="SIGN UP"
            type="solid"
            titleStyle={{ fontSize: 15 }}
            buttonStyle={styles.ButtonStyle}
            onPress={() => validateForm()}
          />
          <Text
            style={[
              styles.TextStyle,
              { fontSize: 12, color: global.textGrayColor, marginTop: 5 },
            ]}
          >
            Already have an account?
          </Text>
          <Text
            onPress={() => navigation.navigate("LoginScreen")}
            style={[
              styles.TextStyle,
              {
                fontSize: 15,
                color: global.textBlueColor,
                fontWeight: "bold",
              },
            ]}
          >
            Sign in from here
          </Text>
        </View>
      </ScrollView>
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
    width: "90%",
    color: "#fff",
    height: 50,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#707070",
  },
  FormContainer: {
    padding: 20,
  },

  inputContainerStyle: {
    elevation: 1,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#707070",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  inputContainerErrorStyle: {
    elevation: 1,
    borderRadius: 100,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "red",
    shadowColor: "#000",
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
    textAlign: "center",
  },
});

export default SignupScreen;
