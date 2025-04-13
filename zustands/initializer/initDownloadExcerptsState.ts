import useDiscoverStore from "../useDiscoverStore";
import useStorageStore from "../useStorageStore";
import storeDownloadSoundState from "@/zustands/storeDownloadSoundState";

const numberToDownload = 30;

const initDownloadExcerptsState = () => {
  const setIsStorageOk = useStorageStore.getState().setIsStorageOk;
  const setDownloadExcerptState =
    useDiscoverStore.getState().setDownloadExcerptState;
  const excerptDirectory = process.env.EXPO_PUBLIC_EXCERPT_DIRECTORY;

  if (!excerptDirectory) {
    console.error("EXPO_PUBLIC_EXCERPT_DIRECTORY is not defined");
    return;
  }

  const unsubscribeDiscoverStore = useDiscoverStore.subscribe(
    (state) => {
      const discoverSoundsState = state.fetchDiscoverSoundsState;
      const position = state.position;
      // Since we create a new array every time, we need to use the equality function
      // to override the default comparison that checks for reference equality of the arrays
      // and not the content of the arrays => Without it, the function would be called infinite times
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
      equalityFn: (current, prev) => {
        const {
          discoverSoundsState: currentDiscoverSoundsState,
          position: currentPosition,
        } = current;
        const {
          discoverSoundsState: prevDiscoverSoundsState,
          position: prevPosition,
        } = prev;
        return (
          currentDiscoverSoundsState.status ===
            prevDiscoverSoundsState.status &&
          currentPosition.currentPosition === prevPosition.currentPosition
        );
      },
    }
  );

  return unsubscribeDiscoverStore;
};

export default initDownloadExcerptsState;
