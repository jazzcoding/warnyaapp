import * as firebase from "firebase";
import "firebase/firestore";
import "./global";
import { Alert } from "react-native";
export async function registration(
  email,
  password,
  username,
  phone,
  preferences
) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    var date = new Date().getDate(); //To get the Current Date
    var month = new Date().getMonth() + 1; //To get the Current Month
    var year = new Date().getFullYear(); //To get the Current Year
    const currentUser = firebase.auth().currentUser;
    global.uid = currentUser.uid;
    const signupUser = await firebase
      .database()
      .ref("users/" + currentUser.uid);
    signupUser.set({
      id: currentUser.uid,
      email,
      username,
      date: date + "/" + month + "/" + year,
      phone,
      password,
      preferences,
    });
    return "success";
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
    return "error";
  }
}
export async function signIn(email, password) {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;
    global.uid = currentUser.uid;
    return "success";
  } catch (error) {
    alert(error);
    return "error";
  }
}
export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}
/*
export async function getCurrentUser() {
  try {
    await firebase
      .database()
      .ref("users/" + `${global.uid}`)
      .on("value", function (snapshot) {
        global.email = snapshot.val().email;
        global.username = snapshot.val().username;
        global.phone = snapshot.val().phone;
        console.log(snapshot.val());
      });
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}
*/

export async function registerName(firstname, lastname, username) {
  try {
    firebase
      .database()
      .ref("users/" + global.uid)
      .update({ firstname, lastname, username });
  } catch (err) {
    Alert.alert("There is something wrong!!!!", err.message);
  }
}

export async function registerNameSignUp(firstname, lastname) {
  try {
    firebase
      .database()
      .ref("users/" + global.uid)
      .update({ firstname, lastname });
  } catch (err) {
    Alert.alert("There is something wrong!!!!", err.message);
  }
}

export async function registerLanguage(userSignedIn, language) {
  try {
    firebase
      .database()
      .ref("users/" + global.uid)
      .update({ language });
    userSignedIn();
  } catch (err) {
    Alert.alert("There is something wrong!!!!", err.message);
  }
}

export async function updateAccountSettings(
  userLogin,
  phone,
  email,
  password,
  preferences
) {
  try {
    firebase
      .database()
      .ref("users/" + global.uid)
      .update({ phone, email, password, preferences });
    userLogin();
  } catch (err) {
    Alert.alert("There is something wrong!!!!", err.message);
  }
}

export async function uploadProfilePicture(navigation, userPicture) {
  try {
    firebase
      .database()
      .ref("users/" + global.uid)
      .update({ userPicture });
    navigation.navigate("LanguageScreen");
  } catch (err) {
    Alert.alert("There is something wrong!!!!", err.message);
  }
}

export async function deleteUser(userLogin) {
  firebase
    .auth()
    .currentUser.delete()
    .then(function () {
      userLogin();
      Alert.alert("Successs!", "You have successfully delete your account.");
    })
    .catch(function (error) {
      Alert.alert("There is something wrong!!!!", error.message);
    });
}
