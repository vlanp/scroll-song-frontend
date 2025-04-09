import { createContext, ReactNode, useEffect, useState } from "react";
import { AppState, NativeModules, Platform } from "react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import {
  INetworkState,
  networkError,
  networkIdle,
  networkLoading,
  networkSuccess,
} from "@/interfaces/INetworkState";

export const NetworkContext = createContext<INetworkState>(networkIdle);

export const NetworkProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [networkState, setNetworkState] = useState<INetworkState>(networkIdle);

  useEffect(() => {
    setNetworkState(networkLoading);
    const handleNetInfo = (netInfo: NetInfoState) => {
      if (
        netInfo.isConnected === false ||
        netInfo.isInternetReachable === false
      ) {
        setNetworkState(networkError);
      } else {
        setNetworkState(networkSuccess);
      }
    };

    const subAppState = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (Platform.OS === "ios" && nextAppState === "active") {
          const newNetInfo: NetInfoState =
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
    <NetworkContext.Provider value={networkState}>
      {children}
    </NetworkContext.Provider>
  );
};
