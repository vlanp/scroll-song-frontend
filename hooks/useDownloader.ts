import IDiscoverSound from "../interfaces/IDiscoverSound";
import { useDownloadStore } from "../zustands/useDownloadStore";
import { useEffect, useRef } from "react";
import { download } from "../utils/download";
import getExcerptUri from "../utils/getExcerptUri";
import { useDiscoverStore } from "../zustands/useDiscoverStore";

const numberToDownload = 30;

const useDownloader = (
  isLoading: boolean,
  error: unknown,
  data: IDiscoverSound[],
  directory?: string
) => {
  const setExcerptDownloadState = useRef(
    useDownloadStore.getState().setExcerptDownloadState
  );
  const setIsStorageError = useRef(
    useDownloadStore.getState().setIsStorageError
  );
  const lastDownload = useRef<number>(null);
  const isInit = useRef<boolean>(false);

  if (!isLoading && !error && data && !isInit.current) {
    data.forEach((sound) => {
      setExcerptDownloadState.current(sound.id);
    });
    isInit.current = true;
  }

  useEffect(() => {
    if (!isInit.current) {
      return;
    }

    const callback = (currentPosition: number) => {
      const dataLastIndex = data.length - 1;

      const limit =
        currentPosition + numberToDownload <= dataLastIndex
          ? currentPosition + numberToDownload
          : dataLastIndex;

      if ((lastDownload.current || 0) >= limit) {
        return;
      }

      // console.log("last download: ", lastDownload);

      for (let i = lastDownload.current || 0; i <= limit; i++) {
        const sound = data[i];

        const excerptUri = getExcerptUri(
          sound.url,
          sound.start_time_excerpt_ms / 1000,
          sound.end_time_excerpt_ms / 1000
        );
        download(
          sound.id,
          excerptUri,
          setExcerptDownloadState.current,
          setIsStorageError.current,
          directory
        );
      }

      lastDownload.current = limit;
    };

    const unsubscribe = useDiscoverStore.subscribe(
      (state) => state.positionState.currentPosition,
      callback
    );

    callback(useDiscoverStore.getState().positionState.currentPosition);

    return () => {
      unsubscribe();
    };
  }, [data, directory, error, isLoading]);
};

export default useDownloader;
