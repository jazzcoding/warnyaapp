import React from "react";
import { Button, Card, Input, Switch } from "react-native-elements";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../../attribute/context";
import "../../attribute/global";
import * as firebase from "firebase";
import "firebase/firestore";
import "../../db/global";
import LoadingPage from "../../attribute/LoadingPage";
import { deleteUser } from "../../db/firebaseAPI";
import { updateAccountSettings } from "../../db/firebaseAPI";
import { ScrollView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/core";
import moment from "moment";
import { Platform } from "react-native";
import { AdMobInterstitial } from "expo-ads-admob";

const AccountSettingsScreen = ({ navigation }) => {
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [preferences, setPreferences] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const currentUser = firebase.auth().currentUser;
  const [dphone, setdPhone] = React.useState(true);
  const [demail, setdEmail] = React.useState(true);
  const [dpassword, setdPassword] = React.useState(true);
  const { userLogin } = React.useContext(AuthContext);
  const [currentpassword, setCurrentPassword] = React.useState("");

  const [hasEmailError, setHasEmailError] = React.useState(true);
  const [hasPhoneError, setHasPhoneError] = React.useState(true);
  const [hasPasswordError, setHasPasswordError] = React.useState(true);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    setdEmail(true);
    setdPhone(true);
    setdPassword(true);
    setIsLoading(true);
    setTimeout(() => {
      getUserSettings();
    }, 1000);
  }, [isFocused]);

  const emailErrorMessage = !hasEmailError ? global.textErrorEmail : "";
  const phoneErrorMessage = !hasPhoneError ? global.textErrorPhone : "";
  const passwordErrorMessage = !hasPasswordError
    ? global.textErrorPassword
    : "";

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
    const reg = /^[0]?[+123456789]\d{9,14}$/;
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

  const verifyDeletingUser = async () => {
    setIsLoading(true);
    deleteUser(userLogin);
    setIsLoading(false);
  };

  const reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  };
  const changePassword = (currentPassword, newPassword) => {
    reauthenticate(currentPassword)
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            console.log("Password updated!");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const changeEmail = (currentPassword, newEmail) => {
    reauthenticate(currentPassword)
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          .updateEmail(newEmail)
          .then(() => {
            console.log("Email updated!");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        Alert.alert(global.alertErrorTitle, `${global.alertErrorMessage}`, [
          { text: "Ok", onPress: () => console.log("No") },
        ]);
      });
  };

  const updateUserSettings = async () => {
    if (email === "" || hasEmailError === false) {
      Alert.alert(global.alertErrorTitle, `${global.emailError}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else if (phone === "" || hasPhoneError === false) {
      Alert.alert(global.alertErrorTitle, `${global.phoneError}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else if (password === "" || hasPasswordError === false) {
      Alert.alert(global.alertErrorTitle, `${global.passwordError}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else {
      setIsLoading(true);
      showAds();
      changeEmail(currentpassword, email);
      changePassword(currentpassword, password);
      updateAccountSettings(userLogin, phone, email, password, preferences);
      setIsLoading(false);
    }
  };
  const showAds = async () => {
    var now = moment().format("MM/DD/YYYY HH:mm");
    if (moment(global.subscription).isSameOrAfter(moment(now))) {
      return null;
    } else {
      if (Platform.OS === "ios") {
        await AdMobInterstitial.setAdUnitID(
          "ca-app-pub-5356140400244515/9096764428"
        );
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: false });
        await AdMobInterstitial.showAdAsync();
      } else {
        await AdMobInterstitial.setAdUnitID(
          "ca-app-pub-5356140400244515/4547274239"
        );
        await AdMobInterstitial.requestAdAsync({
          servePersonalizedAds: false,
        });
        await AdMobInterstitial.showAdAsync();
      }
    }
  };

  const getUserSettings = async () => {
    try {
      const contactExist = await firebase
        .database()
        .ref("users/" + currentUser.uid)
        .orderByChild("chatUID");
      contactExist.once("value").then((snapshot) => {
        if (snapshot.exists()) {
          setEmail(snapshot.val().email);
          setPhone(snapshot.val().phone);
          setPreferences(snapshot.val().preferences);
          setPassword(snapshot.val().password);
          setCurrentPassword(snapshot.val().password);
          setIsLoading(false);
        } else {
          console.log("File does not exist");
          setIsLoading(false);
        }
      });
    } catch (err) {
      Alert.alert(global.alertErrorTitle, `${global.alertCatch}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    }
  };
  if (isLoading === true) {
    return <LoadingPage />;
  }
  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Input
          label={global.textPhone}
          fontSize={15}
          labelStyle={{ fontSize: 15 }}
          inputContainerStyle={
            hasPhoneError
              ? styles.inputContainerStyle
              : styles.inputContainerErrorStyle
          }
          inputStyle={{
            color: "194A76",
            fontWeight: "bold",
            paddingLeft: 10,
          }}
          disabledInputStyle={{ color: "#194A76", fontWeight: "bold" }}
          renderErrorMessage={true}
          errorMessage={phoneErrorMessage}
          onChangeText={(value) => validateMobile(value)}
          rightIcon={{
            size: 12,
            type: "Entypo",
            name: "edit",
            color: "#fff",
            containerStyle: {
              backgroundColor: "#2F7FEB",
              borderRadius: 100,
              padding: 8,
              marginRight: 10,
            },
            onPress: () => {
              setdPhone(!dphone);
            },
          }}
          value={phone}
          disabled={dphone}
        />
        <Input
          label={global.textEmail}
          fontSize={15}
          labelStyle={{ fontSize: 15 }}
          inputContainerStyle={
            hasEmailError
              ? styles.inputContainerStyle
              : styles.inputContainerErrorStyle
          }
          inputStyle={{
            color: "194A76",
            fontWeight: "bold",
            paddingLeft: 10,
          }}
          disabledInputStyle={{ color: "#194A76", fontWeight: "bold" }}
          onChangeText={(value) => validateEmail(value)}
          renderErrorMessage={true}
          errorMessage={emailErrorMessage}
          rightIcon={{
            size: 12,
            type: "Entypo",
            name: "edit",
            color: "#fff",
            containerStyle: {
              backgroundColor: "#2F7FEB",
              borderRadius: 100,
              padding: 8,
              marginRight: 10,
            },
            onPress: () => {
              setdEmail(!demail);
            },
          }}
          disabled={demail}
          value={email}
        />

        <Input
          label={global.textPassword}
          fontSize={15}
          labelStyle={{ fontSize: 15 }}
          inputContainerStyle={
            hasPasswordError
              ? styles.inputContainerStyle
              : styles.inputContainerErrorStyle
          }
          inputStyle={{
            color: "194A76",
            fontWeight: "bold",
            paddingLeft: 10,
          }}
          disabledInputStyle={{ color: "#194A76", fontWeight: "bold" }}
          onChangeText={(value) => validatePassword(value)}
          secureTextEntry={true}
          renderErrorMessage={true}
          errorMessage={passwordErrorMessage}
          rightIcon={{
            size: 12,
            type: "Entypo",
            name: "edit",
            color: "#fff",
            containerStyle: {
              backgroundColor: "#2F7FEB",
              borderRadius: 100,
              padding: 8,
              marginRight: 10,
            },
            onPress: () => {
              setdPassword(!dpassword);
            },
          }}
          value={password}
          disabled={dpassword}
        />
        <Text style={[styles.TextStyle, { fontSize: 15, color: "#2F7FEB" }]}>
          {global.textPreferences}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              styles.TextStyle,
              { fontSize: 12, color: "#707070", maxWidth: "80%" },
            ]}
          >
            {global.textPreferencesMessage}
          </Text>
          <Switch
            value={preferences === "true" ? true : false}
            color="#68D682"
            onValueChange={() => {
              if (preferences === "true") {
                setPreferences("false");
              } else {
                setPreferences("true");
              }
            }}
          />
        </View>
        <Text style={[styles.TextStyle, { fontSize: 15, color: "#2F7FEB" }]}>
          {global.textDeleteAccount}
        </Text>
        <Text style={[styles.TextStyle, { fontSize: 12, color: "#707070" }]}>
          {global.textDeleteAccountMessage}
        </Text>
        <Button
          title={global.buttonDeleteAccountPermanently}
          type="outline"
          titleStyle={{ color: "#DD5454", fontSize: 12 }}
          buttonStyle={{
            borderColor: "#707070",
            width: "60%",
            borderRadius: 100,
            marginLeft: 10,
            padding: 2,
          }}
          onPress={() => {
            Alert.alert(global.textAlert, global.alertConfirmDeleteAccount, [
              {
                text: global.alertButtonYes,
                onPress: () => verifyDeletingUser("yes"),
              },
              { text: global.alertButtonNo, onPress: () => console.log("No") },
            ]);
          }}
        />
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-evenly",
            marginTop: 10,
          }}
        >
          <Button
            title={global.buttonSaveSettings}
            type="solid"
            titleStyle={{ fontSize: 12 }}
            buttonStyle={styles.ButtonStyle}
            onPress={() => {
              Alert.alert(global.textAlert, alertConfimAutomaticallyLoggedOut, [
                {
                  text: global.alertButtonYes,
                  onPress: () => updateUserSettings(),
                },
                {
                  text: global.alertButtonNo,
                  onPress: () => console.log("No"),
                },
              ]);
            }}
          />
          <Button
            title={global.textBack}
            type="solid"
            titleStyle={{ fontSize: 12, color: "#2F7FEB" }}
            buttonStyle={[styles.ButtonStyle, { backgroundColor: "#fff" }]}
            onPress={() => {
              navigation.navigate("HomepageScreen");
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
  },
  ButtonStyle: {
    borderWidth: 1,
    borderColor: "#707070",
    minWidth: "100%",
    color: "#fff",
    borderRadius: 100,
    alignSelf: "center",
    padding: 15,
    margin: 10,
  },
  inputContainerStyle: {
    elevation: 0,
    borderRadius: 100,
    borderWidth: 1,
    paddingLeft: 20,
    height: 45,
    backgroundColor: "#fff",
  },
  inputContainerErrorStyle: {
    elevation: 1,
    borderRadius: 100,
    height: 45,
    borderWidth: 1,
    paddingLeft: 20,
    backgroundColor: "#fff",
    borderColor: "red",
  },
  TextStyle: {
    padding: 10,
    width: "100%",
  },
});

export default AccountSettingsScreen;
