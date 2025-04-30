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

export type { IFontsState, IFontsError, IFontsLoaded, IFontsLoading };
export { fontsLoading, fontsError, fontsLoaded };
