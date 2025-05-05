import handleReceivedData from "../../utils/discover/handleReceivedData";
import storeFetchDataState from "../storeFetchDataState";
import useDiscoverStore from "../useDiscoverStore";

const initFetchDiscoverSoundsState = (authToken: string) => {
  const setFetchDiscoverSoundsState =
    useDiscoverStore.getState().setFetchDiscoverSoundsState;
  const expoPublicApiUrl = process.env.EXPO_PUBLIC_API_URL;
  const discoverEndpoint = process.env.EXPO_PUBLIC_DISCOVER_ENDPOINT;

  if (!expoPublicApiUrl || !discoverEndpoint) {
    console.error(
      "EXPO_PUBLIC_API_URL or EXPO_PUBLIC_DISCOVER_ENDPOINT is not defined"
    );
    return;
  }
  const abortController = storeFetchDataState(
    expoPublicApiUrl + discoverEndpoint,
    setFetchDiscoverSoundsState,
    authToken,
    handleReceivedData
  );
  return abortController;
};

export default initFetchDiscoverSoundsState;
