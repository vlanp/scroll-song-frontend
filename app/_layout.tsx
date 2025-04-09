import { Tabs } from "expo-router";
import { NetworkProvider } from "../contexts/NetworkContext";
import { SoundsProvider } from "../contexts/SoundsContext";
import { ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PoppinsRegularFont from "../assets/fonts/Poppins-Regular.ttf";
import PoppinsBoldFont from "../assets/fonts/Poppins-Bold.ttf";
import PoppinsMediumFont from "../assets/fonts/Poppins-Medium.ttf";
import PoppinsSemiBoldFont from "../assets/fonts/Poppins-SemiBold.ttf";
import LexendLightFont from "../assets/fonts/Lexend-Light.ttf";
import LexendRegularFont from "../assets/fonts/Lexend-Regular.ttf";
import LexendSemiBoldFont from "../assets/fonts/Lexend-SemiBold.ttf";
import LexendBoldFont from "../assets/fonts/Lexend-Bold.ttf";
import RobotoCondensedRegularFont from "../assets/fonts/RobotoCondensed-Regular.ttf";
import RobotoCondensedBoldFont from "../assets/fonts/RobotoCondensed-Bold.ttf";
import LatoBoldFont from "../assets/fonts/Lato-Bold.ttf";
import LatoHeavyFont from "../assets/fonts/Lato-Heavy.ttf";
import LatoSemiboldFont from "../assets/fonts/Lato-Semibold.ttf";

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: PoppinsRegularFont,
    PoppinsBold: PoppinsBoldFont,
    PoppinsMedium: PoppinsMediumFont,
    PoppinsSemiBold: PoppinsSemiBoldFont,
    LexendLight: LexendLightFont,
    LexendRegular: LexendRegularFont,
    LexendSemiBold: LexendSemiBoldFont,
    LexendBold: LexendBoldFont,
    RobotoCondensedRegular: RobotoCondensedRegularFont,
    RobotoCondensedBold: RobotoCondensedBoldFont,
    LatoBold: LatoBoldFont,
    LatoHeavy: LatoHeavyFont,
    LatoSemibold: LatoSemiboldFont,
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
