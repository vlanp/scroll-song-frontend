import IDiscoverSound from "../interfaces/IDiscoverSound";
import { useDownloadStore } from "../zustands/useDownloadStore";
import { useRef, useState } from "react";
import { createDirectory, download } from "../utils/download";
import getExcerptUri from "../utils/getExcerptUri";

const numberToDownload = 30;

const useDownloader = (
  isLoading: boolean,
  error: unknown,
  data: IDiscoverSound[],
  directory?: string
) => {
  const currentPosition = useDownloadStore((state) => state.currentPosition);
  const lastDownload = useRef<number>(null);
  const setExcerptDownloadState = useDownloadStore(
    (state) => state.setExcerptDownloadState
  );
  const setIsStorageError = useDownloadStore(
    (state) => state.setIsStorageError
  );
  const [isDownloadStoreInit, setIsDownloadStoreInit] =
    useState<boolean>(false);

  if (isLoading || error || !data) {
    return;
  }

  if (!isDownloadStoreInit) {
    data.forEach((sound) => {
      setExcerptDownloadState(sound.id);
    });
    setIsDownloadStoreInit(true);
  }

  const dataLastIndex = data.length - 1;

  const limit =
    currentPosition + numberToDownload <= dataLastIndex
      ? currentPosition + numberToDownload
      : dataLastIndex;

  if ((lastDownload.current || 0) >= limit) {
    return;
  }

  console.log("last download: ", lastDownload);

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
      setExcerptDownloadState,
      setIsStorageError,
      directory
    );
  }

  lastDownload.current = limit;
};

export default useDownloader;
