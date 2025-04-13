import useNetworkStore, {
  networkError,
  networkLoading,
  networkSuccess,
} from "../useNetworkStore";
import { AppState, NativeModules, Platform } from "react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

const initNetworkState = () => {
  const setNetworkState = useNetworkStore.getState().setNetworkState;

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
};

export default initNetworkState;
