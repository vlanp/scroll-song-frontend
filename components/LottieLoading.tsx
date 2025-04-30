import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import lottieMusicNote from "../assets/lotties/music-note.json";
import ScreenContainer from "./ScreenContainer";

const LottieLoadingScreen = () => {
  return (
    <ScreenContainer style={styles.animationContainer}>
      <LottieView
        autoPlay
        style={{
          width: 150,
          height: 150,
        }}
        source={lottieMusicNote}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LottieLoadingScreen;
