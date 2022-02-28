import React from "react";
import { Button } from "react-native-elements";
import { View, Text, StyleSheet, TextInput, Dimensions,Alert } from "react-native";
import { AuthContext } from "../../attribute/context";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import Constants from 'expo-constants';
import * as firebase from "firebase";
const PhoneVerificationScreen = ({navigation}) => {
  const windowHeight = Dimensions.get("screen").height;
  const { userSignedIn } = React.useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [code, setCode] = React.useState('');
  const [verificationId, setVerificationId] = React.useState(null);
  const recaptchaVerifier = React.useRef(null);

 React.useEffect(() => {
   sendVerification()
  }, []);

    const sendVerification = () => {
      try{
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber("+639954370873", recaptchaVerifier.current)
      .then(setVerificationId);
        Alert.alert("Success", `${global.successOTP}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
      }catch(err){
         Alert.alert("ERROR", `${err}`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
      }
    }

  const confirmCode = () => {
    try{
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
        firebase
      .auth()
      .credential(credential)
      .then((result) => {
        // Do something with the results here
        console.log(result);
      });
    }catch(err){
       Alert.alert("Success", `${global.successOTP}`, [
        { text: "Ok", onPress: () => console.log("No") }
      ]);
  };
  }

 


  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.TextStyle,
          { fontSize: global.fontTitleSize, color: global.textBlueColor },
        ]}
      >
        Phone Verification
      </Text>

      <Text
        style={[
          styles.TextStyle,
          { fontSize: global.fontTextSize, color: global.textGrayColor },
        ]}
      >
        {global.accountVerificationMessage}
      </Text>
      <View style={styles.FitToText}>
        <TextInput style={styles.InputContainerStyle}  onChangeText={(value) => setCode(value)} />
      </View>
      <Button
        title="SUBMIT"
        type="solid"
        buttonStyle={[styles.ButtonStyle, { marginTop: windowHeight / 3 }]}
        onPress={() => confirmCode()}
      />


      <FirebaseRecaptchaVerifierModal
      ref={recaptchaVerifier}
      firebaseConfig={firebase.app().options}/>
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
    width: 300,
    color: global.textWhiteColor,
    height: 50,
    borderRadius: 100,
    alignSelf: "center",
  },

  InputContainerStyle: {
    width: 100,
    height: 50,
    borderRadius: 100,
    borderWidth: 1,
    textAlign: "center",
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: global.inputWhiteColor,
  },
  TextStyle: {
    marginTop: 100,
    padding: 10,
    textAlign: "center",
  },
  FitToText: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
});

export default PhoneVerificationScreen;
