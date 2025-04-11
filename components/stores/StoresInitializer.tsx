import handleReceivedData from "@/utils/discover/handleReceivedData";
import storeDownloadSoundsState from "@/zustands/storeDownloadSoundState";
import storeFetchDataState from "@/zustands/storeFetchDataState";
import { useDiscoverStore } from "@/zustands/useDiscoverStore";
import useStorageStore from "@/zustands/useStorageStore";
import { ReactNode, useEffect } from "react";

const numberToDownload = 30;

const StoresInitializer = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  useEffect(() => {
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

    const setIsStorageOk = useStorageStore.getState().setIsStorageOk;
    const setDownloadExcerptState =
      useDiscoverStore.getState().setDownloadExcerptState;
    const excerptDirectory = process.env.EXCERPT_DIRECTORY;

    if (!excerptDirectory) {
      console.error("EXCERPT_DIRECTORY is not defined");
      return;
    }

    const unsubscribeDiscoverStore = useDiscoverStore.subscribe(
      (state) => {
        const discoverSoundsState = state.fetchDiscoverSoundsState;
        const position = state.position;
        return { discoverSoundsState, position };
      },
      (selectedState) => {
        const { discoverSoundsState, position } = selectedState;
        const currentPosition = position.currentPosition;
        if (discoverSoundsState.status === "fetchDataSuccess") {
          const lastIndex = discoverSoundsState.data.length - 1;
          const limitMin =
            currentPosition - numberToDownload >= 0
              ? currentPosition - numberToDownload
              : 0;
          const limitMax =
            currentPosition + numberToDownload <= lastIndex
              ? currentPosition + numberToDownload
              : lastIndex;

          const downloadExcerptsState =
            useDiscoverStore.getState().downloadExcerptsState;

          for (let i = limitMin; i <= limitMax; i += 1) {
            const sound = discoverSoundsState.data[i];
            if (downloadExcerptsState[sound.id]) {
              return;
            }
            storeDownloadSoundsState(
              sound,
              setDownloadExcerptState,
              setIsStorageOk,
              excerptDirectory
            );
          }
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
