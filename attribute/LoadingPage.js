import { useIsFocused } from "@react-navigation/core";
import React from "react";
import { Image, Text, View, Animated } from "react-native";
const LoadingPage = () => {
  const isFocused = useIsFocused();
  const anim = React.useRef(new Animated.Value(1));
  React.useEffect(() => {}, [isFocused]);
  Animated.loop(
    // runs given animations in a sequence
    Animated.sequence([
      // increase size
      Animated.timing(anim.current, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      // decrease size
      Animated.timing(anim.current, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ])
  ).start();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: global.backgroundBlueColor,
        elevation: 5,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          position: "absolute",
          height: 100,
          width: 100,
          alignSelf: "center",
          borderRadius: 100,
          position: "absolute",
        }}
      />

      <Animated.Image
        source={require("../assets/Warnyaicon.png")}
        resizeMode="cover"
        style={{
          width: 90,
          height: 90,
          position: "absolute",
          borderRadius: 100,
          alignSelf: "center",
          borderColor: "#fff",
          transform: [{ scale: anim.current }],
        }}
      ></Animated.Image>
      <Text
        style={{
          fontSize: global.fontTextSize,
          alignSelf: "center",
          padding: 20,
          marginTop: 130,
          color: global.textWhiteColor,
        }}
      >
        {global.textPleaseWait}
      </Text>
    </View>
  );
};

export default LoadingPage;
