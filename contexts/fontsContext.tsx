import { createContext, PropsWithChildren } from "react";
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
import { useFonts } from "expo-font";

type IFontsState = IFontsError | IFontsLoaded | IFontsLoading;

interface IFontsLoading {
  status: "fontsLoading";
}
const fontsLoading: IFontsLoading = {
  status: "fontsLoading",
};

interface IFontsLoaded {
  status: "fontsLoaded";
}
const fontsLoaded: IFontsLoaded = {
  status: "fontsLoaded",
};

interface IFontsError {
  status: "fontsError";
}
const fontsError: IFontsError = {
  status: "fontsError",
};

const FontsContext = createContext<IFontsState>(fontsLoading);

const FontsProvider = ({ children }: PropsWithChildren) => {
  const [isLoaded, error] = useFonts({
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

  if (error) {
    console.error(error);
  }

  const fontsState = error ? fontsError : isLoaded ? fontsLoaded : fontsLoading;

  return (
    <FontsContext.Provider value={fontsState}>{children}</FontsContext.Provider>
  );
};

export { FontsContext, FontsProvider };
