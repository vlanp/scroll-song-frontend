import { createContext, ReactNode, useEffect, useState } from "react";
import { AppState, NativeModules, Platform } from "react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import {
  INetwork,
  networkError,
  networkIdle,
  networkLoading,
  networkSuccess,
} from "@/interfaces/INetworkContext";

export const NetworkContext = createContext<INetwork>(networkIdle);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [network, setNetwork] = useState<INetwork>(networkIdle);

  useEffect(() => {
    setNetwork(networkLoading);
    const handleNetInfo = (netInfo: NetInfoState) => {
      if (
        netInfo.isConnected === false ||
        netInfo.isInternetReachable === false
      ) {
        setNetwork(networkError);
      } else {
        setNetwork(networkSuccess);
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
    <NetworkContext.Provider value={network}>
      {children}
    </NetworkContext.Provider>
  );
};
