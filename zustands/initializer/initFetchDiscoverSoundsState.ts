import handleReceivedData from "@/utils/discover/handleReceivedData";
import storeFetchDataState from "../storeFetchDataState";
import { useDiscoverStore } from "../useDiscoverStore";

const initFetchDiscoverSoundsState = () => {
  const setFetchDiscoverSoundsState =
    useDiscoverStore.getState().setFetchDiscoverSoundsState;
  const expoPublicApiUrl = process.env.EXPO_PUBLIC_API_URL;
  const discoverEndpoint = process.env.DISCOVER_ENDPOINT;

  if (!expoPublicApiUrl || !discoverEndpoint) {
    console.error("EXPO_PUBLIC_API_URL or DISCOVER_ENDPOINT is not defined");
    return;
  }
  const abortController = storeFetchDataState(
    expoPublicApiUrl + discoverEndpoint,
    setFetchDiscoverSoundsState,
    "5a6251db-8f7e-4101-9577-3f5accfade3c", // TODO: Create a unique ID for each user
    handleReceivedData
  );
  return abortController;
};

export default initFetchDiscoverSoundsState;
