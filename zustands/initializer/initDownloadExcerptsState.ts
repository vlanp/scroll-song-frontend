import { useDiscoverStore } from "../useDiscoverStore";
import useStorageStore from "../useStorageStore";
import storeDownloadSoundState from "@/zustands/storeDownloadSoundState";

const numberToDownload = 30;

const initDownloadExcerptsState = () => {
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
          storeDownloadSoundState(
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

  return unsubscribeDiscoverStore;
};

export default initDownloadExcerptsState;
