import React from "react";
import { View, StyleSheet, Image, Linking } from "react-native";
import { Button } from "react-native-elements";
import { useIsFocused } from "@react-navigation/core";
import LoadingPage from "../../attribute/LoadingPage";
const ContactUsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isFocused]);

  if (isLoading === true) {
    return <LoadingPage />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.FitToText}>
        <Image
          style={styles.ImageStyle}
          source={require("../../assets/contactus/1.png")}
          resizeMode="contain"
        />
        <Image
          style={styles.ImageStyle}
          source={require("../../assets/contactus/2.png")}
          resizeMode="contain"
        />
      </View>
      <View style={styles.FitToText}>
        <Button
          title={global.btnaAskQuestion}
          type="solid"
          titleStyle={styles.TextStyle}
          buttonStyle={styles.ButtonStyle}
          onPress={() => {
            Linking.openURL(
              "mailto:warnya.appservice@gmail.com?subject=Ask Question"
            ).catch((err) => console.error("Couldn't load page", err));
          }}
        />

        <Button
          title={btnSuggestIdeas}
          type="solid"
          titleStyle={styles.TextStyle}
          buttonStyle={styles.ButtonStyle}
          onPress={() => {}}
          onPress={() => {
            Linking.openURL(
              "mailto:warnya.appservice@gmail.com?subject=Suggest Ideas"
            ).catch((err) => console.error("Couldn't load page", err));
          }}
        />
      </View>
      <View style={styles.FitToText}>
        <Image
          style={styles.ImageStyle}
          source={require("../../assets/contactus/3.png")}
          resizeMode="contain"
        />
        <Image
          style={styles.ImageStyle}
          source={require("../../assets/contactus/4.png")}
          resizeMode="contain"
        />
      </View>
      <View style={styles.FitToText}>
        <Button
          title={global.btnReportBug}
          type="solid"
          titleStyle={styles.TextStyle}
          buttonStyle={styles.ButtonStyle}
          onPress={() => {
            Linking.openURL(
              "mailto:warnya.appservice@gmail.com?subject=Report a bug"
            ).catch((err) => console.error("Couldn't load page", err));
          }}
        />

        <Button
          title={global.btnVisitOurSite}
          type="solid"
          titleStyle={styles.TextStyle}
          buttonStyle={styles.ButtonStyle}
          onPress={() => {
            Linking.openURL("https://www.instagram.com/warnya.official/").catch(
              (err) => console.error("Couldn't load page", err)
            );
          }}
        />
      </View>
      <Button
        title={global.textBack}
        type="clear"
        titleStyle={{
          fontSize: 12,
          color: "#2F7FEB",
        }}
        containerStyle={{
          backgroundColor: "#fff",
          borderWidth: 1,
          padding: 5,
          width: "80%",
          alignSelf: "center",
          borderColor: "#707070",
          borderRadius: 100,
          marginTop: 100,
        }}
        onPress={() => {
          navigation.navigate("HomepageScreen");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
  },
  inputContainerStyle: {
    elevation: 1,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  TextStyle: {
    padding: 10,
    width: "100%",
    textAlign: "center",
    fontSize: 12,
  },
  FitToText: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  ImageStyle: {
    width: 100,
    height: 100,
    backgroundColor: "white",
  },

  ButtonStyle: {
    width: "60%",
    margin: 20,
    color: "#fff",
    borderRadius: 100,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#707070",
  },
});

export default ContactUsScreen;
