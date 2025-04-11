import handleReceivedData from "@/utils/discover/handleReceivedData";
import storeDownloadSoundsState from "@/zustands/storeDownloadSoundState";
import storeFetchDataState from "@/zustands/storeFetchDataState";
import { useDiscoverStore } from "@/zustands/useDiscoverStore";
import useStorageStore from "@/zustands/useStorageStore";
import { ReactNode, useEffect } from "react";

const StoresInitializer = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  useEffect(() => {
    const setDiscoverSoundsState =
      useDiscoverStore.getState().setFetchDiscoverSoundsState;
    const expoPublicApiUrl = process.env.EXPO_PUBLIC_API_URL;
    const discoverEndpoint = process.env.DISCOVER_ENDPOINT;

    if (!expoPublicApiUrl || !discoverEndpoint) {
      console.error("API URL or endpoint is not defined");
      return;
    }
    const abortController = storeFetchDataState(
      expoPublicApiUrl + discoverEndpoint,
      setDiscoverSoundsState,
      "5a6251db-8f7e-4101-9577-3f5accfade3c", // TODO: Create a unique ID for each user
      handleReceivedData
    );

    const setIsStorageOk = useStorageStore.getState().setIsStorageOk;

    const unsubscribeDiscoverStore = useDiscoverStore.subscribe(
      (state) => {
        const discoverSoundsState = state.fetchDiscoverSoundsState;
        return { discoverSoundsState };
      },
      (selectedState) => {
        if (selectedState.discoverSoundsState.status === "fetchDataSuccess") {
          storeDownloadSoundsState(selectedState.discoverSoundsState.data);
        }
      },
      {
        fireImmediately: true,
      }
    );

    return () => {
      abortController.abort();
      unsubscribeDiscoverStore();
    };
  }, []);

  return <>{children}</>;
};

export default StoresInitializer;
