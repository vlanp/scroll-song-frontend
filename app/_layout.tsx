import { Tabs } from "expo-router";
import { NetworkProvider } from "../contexts/NetworkContext";
import { SoundsProvider } from "../contexts/SoundsContext";
import { ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
  let [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    LexendLight: require("../assets/fonts/Lexend-Light.ttf"),
    LexendRegular: require("../assets/fonts/Lexend-Regular.ttf"),
    LexendSemiBold: require("../assets/fonts/Lexend-SemiBold.ttf"),
    LexendBold: require("../assets/fonts/Lexend-Bold.ttf"),
    RobotoCondensedRegular: require("../assets/fonts/RobotoCondensed-Regular.ttf"),
    RobotoCondensedBold: require("../assets/fonts/RobotoCondensed-Bold.ttf"),
    LatoBold: require("../assets/fonts/Lato-Bold.ttf"),
    LatoHeavy: require("../assets/fonts/Lato-Heavy.ttf"),
    LatoSemibold: require("../assets/fonts/Lato-Semibold.ttf"),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <GestureHandlerRootView>
      <NetworkProvider>
        <SoundsProvider>
          <Tabs />
        </SoundsProvider>
      </NetworkProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
