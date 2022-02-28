import React from "react";
import { Button, Card } from "react-native-elements";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../../attribute/context";
import HeaderDesign from "../../attribute/HeaderDesign";
import { registerNameSignUp } from "../../db/firebaseAPI";
import { ScrollView } from "react-native-gesture-handler";
AuthContext;
const NameScreen = ({ navigation }) => {
  const [firstname, setFirstName] = React.useState("");
  const [lastname, setLastName] = React.useState("");

  const registerFirstAndLastName = async () => {
    if (firstname === "") {
      Alert.alert("ERROR", `Please enter your first name and last name.`, [
        { text: "Ok", onPress: () => console.log("No") },
      ]);
    } else {
      registerNameSignUp(firstname, lastname);
      navigation.navigate("ProfilePhotoScreen");
    }
  };
  return (
    <View style={styles.container}>
      <HeaderDesign />
      <ScrollView>
        <View style={{ justifyContent: "center", margin: 20 }}>
          <Text
            style={[
              styles.TextStyle,
              {
                fontSize: global.fontTitleSize,
                color: "#194a76",
                fontWeight: "bold",
              },
            ]}
          >
            What Is Your Name?
          </Text>
          <Text
            style={[
              styles.TextStyle,
              { fontSize: global.fontTextSize, color: global.textGrayColor },
            ]}
          >
            We highly encourage you to use the name you have in real life.
          </Text>

          <View style={{ flexDirection: "row", margin: 20 }}>
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#707070"
              style={[
                styles.inputContainerStyle,
                { borderTopLeftRadius: 100, borderBottomLeftRadius: 100 },
              ]}
              onChangeText={(value) => setFirstName(value)}
            />
            <TextInput
              placeholder="Last Name (Optional)"
              placeholderTextColor="#707070"
              style={[
                styles.inputContainerStyle,
                { borderTopRightRadius: 100, borderBottomRightRadius: 100 },
              ]}
              onChangeText={(value) => setLastName(value)}
            />
          </View>
          <Button
            title="NEXT"
            type="solid"
            titleStyle={{ fontSize: 15 }}
            buttonStyle={styles.ButtonStyle}
            onPress={() => registerFirstAndLastName()}
          />
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
    width: "75%",
    color: global.textWhiteColor,
    padding: 10,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 50,
    borderWidth: 2,
    borderColor: "#707070",
  },
  FormContainer: {
    margin: 0,
    borderWidth: 0,
    elevation: 0,
  },

  inputContainerStyle: {
    elevation: 1,
    borderWidth: 0.5,
    padding: 10,
    width: "50%",
    borderColor: "#707070",
    backgroundColor: global.inputWhiteColor,
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
    width: "100%",
    textAlign: "center",
  },
});

export default NameScreen;
