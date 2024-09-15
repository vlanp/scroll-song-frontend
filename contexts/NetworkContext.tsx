import { createContext, ReactNode, useEffect, useState } from "react";
import { AppState, NativeModules, Platform } from "react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export const NetworkContext = createContext<INetworkContext | null>(null);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [isNetworkError, setIsNetworkError] = useState<boolean | null>(null);

  useEffect(() => {
    const handleNetInfo = (netInfo: NetInfoState) => {
      if (
        netInfo.isConnected === false ||
        netInfo.isInternetReachable === false
      ) {
        setIsNetworkError(true);
      } else {
        setIsNetworkError(false);
      }
    };

    const subAppState = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (Platform.OS === "ios" && nextAppState == "active") {
          let newNetInfo: NetInfoState =
            await NativeModules.RNCNetInfo.getCurrentState("wifi");
          handleNetInfo(newNetInfo);
        }
      }
    );
    const unsubNetState = NetInfo.addEventListener((netInfo) => {
      handleNetInfo(netInfo);
    });

    return () => {
      if (subAppState) {
        subAppState.remove();
      }
      unsubNetState();
    };
  });

  return (
    <NetworkContext.Provider value={{ isNetworkError }}>
      {children}
    </NetworkContext.Provider>
  );
};
