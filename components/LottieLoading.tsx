import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import lottieMusicNote from "../assets/lotties/music-note.json";

const LottieLoading = () => {
  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        style={{
          width: 150,
          height: 150,
        }}
        source={lottieMusicNote}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#010101",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default LottieLoading;
