import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Button, Icon } from "react-native-elements";
import * as firebase from "firebase";
import "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import { english } from "../HelperClass/Language";
import { italian } from "../HelperClass/Language";
import { french } from "../HelperClass/Language";
import { dutch } from "../HelperClass/Language";
import { deutsch } from "../HelperClass/Language";
import { AuthContext } from "../attribute/context";

const CustomNavigation = ({ navigation }) => {
  const { userLogin } = React.useContext(AuthContext);
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const [userPicture, setUserPicture] = React.useState("");
  const [userName, setUsername] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const currentUser = firebase.auth().currentUser;
  React.useEffect(() => {
    setTimeout(() => {
      const getUserImage = firebase.database().ref("users/" + currentUser.uid);
      getUserImage.on("value", async (snapshot) => {
        if (snapshot.val().language === "English") {
          english();
        } else if (snapshot.val().language === "Deutsch") {
          deutsch();
        } else if (snapshot.val().language === "Italian") {
          italian();
        } else if (snapshot.val().language === "French") {
          french();
        } else if (snapshot.val().language === "Dutch") {
          dutch();
        }
        setUserPicture(snapshot.val().userPicture);
        setUsername(snapshot.val().firstname);
        setUserEmail(snapshot.val().email);
        if (snapshot.val().subscription) {
          global.subscription = snapshot.val().subscription;
        } else {
          global.subscription = "";
        }
      });
    }, 5000);
  }, []);

  return (
    <ScrollView>
      <View
        style={{
          height: windowHeight,
        }}
      >
        <Image
          source={require("../assets/sidenavicon/border.png")}
          style={{
            width: "50%",
            height: 150,
            marginLeft: "50%",
            marginTop: -20,
          }}
        />

        <Icon
          name="x"
          type="feather"
          size={20}
          color="#fff"
          containerStyle={{ position: "absolute", top: 40, right: 20 }}
          onPress={() => {
            navigation.navigate("HomepageScreen");
          }}
        />
        <Image
          source={
            userPicture == ""
              ? require("../assets/person.png")
              : {
                  uri:
                    userPicture == null
                      ? "https://firebasestorage.googleapis.com/v0/b/warn-ya-58062.appspot.com/o/defaultProfile.png?alt=media&token=16b4eb8b-5b15-4bdf-b984-540678115ad3"
                      : userPicture,
                }
          }
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            margin: 20,
            position: "absolute",
            top: 50,
            backgroundColor: "#eee",
          }}
        />

        <Text
          style={[
            styles.TextStyle,
            {
              fontSize: global.fontTitleSize,
              color: "#38B3FE",
              backgroundColor: userName == "" ? "#eeee" : "#fff",
              marginTop: 60,
            },
          ]}
        >
          {userName}
        </Text>
        <Text
          style={[
            styles.TextStyle,
            {
              fontSize: global.fontSize,
              color: "#38B3FE",
              backgroundColor: userEmail == "" ? "#eeee" : "#ffff",
            },
          ]}
        >
          {userEmail}
        </Text>

        <Button
          type="clear"
          icon={
            <Image
              source={require("../assets/sidenavicon/editprofileicon.png")}
              style={{ width: 24, height: 24 }}
            />
          }
          iconContainerStyle={{ marginRight: 10 }}
          title={global.editProfile}
          titleStyle={styles.titleTextStyle}
          containerStyle={{
            alignItems: "flex-start",
            marginLeft: 20,
            marginTop: 50,
          }}
          onPress={() => navigation.navigate("EditProfileScreen")}
        />
        <Button
          type="clear"
          icon={
            <Image
              source={require("../assets/sidenavicon/accountsettingicon.png")}
              style={{ width: 24, height: 24 }}
            />
          }
          iconContainerStyle={{ marginRight: 10 }}
          title={global.accountSettings}
          titleStyle={styles.titleTextStyle}
          containerStyle={{ alignItems: "flex-start", marginLeft: 20 }}
          onPress={() => navigation.navigate("AccountSettingsScreen")}
        />
        <Button
          type="clear"
          icon={
            <Image
              source={require("../assets/sidenavicon/languageicon.png")}
              style={{ width: 24, height: 24 }}
            />
          }
          iconContainerStyle={{ marginRight: 10 }}
          title={global.language}
          titleStyle={styles.titleTextStyle}
          containerStyle={{ alignItems: "flex-start", marginLeft: 20 }}
          onPress={() => navigation.navigate("LanguageScreen")}
        />

        <Button
          type="clear"
          icon={
            <Image
              source={require("../assets/sidenavicon/contactusicon.png")}
              style={{ width: 24, height: 24 }}
            />
          }
          iconContainerStyle={{ marginRight: 10 }}
          title={global.contactUs}
          titleStyle={styles.titleTextStyle}
          containerStyle={{
            alignItems: "flex-start",
            marginLeft: 20,
          }}
          onPress={() => navigation.navigate("ContactUsScreen")}
        />

        <Button
          type="solid"
          iconContainerStyle={{ marginRight: 10 }}
          title={global.upgradeToPro}
          titleStyle={{
            paddingLeft: 20,
            paddingRight: 20,
            fontSize: 15,
            color: "#fff",
          }}
          containerStyle={{
            alignSelf: "center",
            alignItems: "flex-start",
            borderRadius: 20,
            bottom: 100,
            position: "absolute",
            backgroundColor: "#2F7FEB",
          }}
          onPress={() => navigation.navigate("UpgradeToPro")}
        />
        <Button
          type="clear"
          iconPosition={"right"}
          icon={
            <Image
              source={require("../assets/sidenavicon/logouticon.png")}
              style={{ width: 20, height: 20, margin: 10 }}
              resizeMode="cover"
            />
          }
          iconContainerStyle={{ marginRight: 10 }}
          title={global.logout}
          titleStyle={[
            styles.titleTextStyle,
            { color: "#707070", alignItems: "center", fontWeight: "bold" },
          ]}
          containerStyle={{
            alignSelf: "center",
            borderRadius: 20,
            position: "absolute",
            bottom: 5,
          }}
          onPress={() => {
            firebase.auth().signOut();
            userLogin();
          }}
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  TextStyle: {
    paddingLeft: 20,
    width: "90%",
    textAlign: "left",
    borderRadius: 100,
    margin: 5,
  },
  titleTextStyle: {
    color: "#194A76",
    marginLeft: 15,
    fontSize: 15,
    fontWeight: "100",
  },
});

export default CustomNavigation;
