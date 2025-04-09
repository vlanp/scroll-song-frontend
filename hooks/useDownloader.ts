import IDiscoverSound from "../interfaces/IDiscoverSound";
import useDownloadStore, {
  excerptDownloadIdle,
} from "../zustands/useDownloadStore";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { download } from "../utils/download";
import getExcerptUri from "../utils/getExcerptUri";
import { useDiscoverStore } from "../zustands/useDiscoverStore";
import { IFetchDataState } from "./useData";
import Immutable from "@/interfaces/Immutable";
import useStorageStore from "@/zustands/useStorageStore";

const numberToDownload = 30;

const useDownloader = (
  discoverSoundsState: Immutable<IFetchDataState<IDiscoverSound[]>>,
  directory?: string
) => {
  const setExcerptDownloadState = useRef(
    useDownloadStore.getState().setExcerptDownloadState
  );

  const setIsStorageError = useRef(useStorageStore.getState().setStorageState);
  const lastDownload = useRef<number | null>(null);

  if (discoverSoundsState.status === "fetchDataSuccess") {
    discoverSoundsState.data.forEach((sound) => {
      setExcerptDownloadState.current(sound.id, excerptDownloadIdle);
    });
  }

  useEffect(() => {
    if (discoverSoundsState.status !== "fetchDataSuccess") {
      return;
    }

    const callback = (currentPosition: number) => {
      const discoverSoundsLastIndex = discoverSoundsState.data.length - 1;

      const limit =
        currentPosition + numberToDownload <= discoverSoundsLastIndex
          ? currentPosition + numberToDownload
          : discoverSoundsLastIndex;

      if ((lastDownload.current || 0) >= limit) {
        return;
      }

      // console.log("last download: ", lastDownload);

      for (let i = lastDownload.current || 0; i <= limit; i++) {
        const sound = discoverSoundsState[i];

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
      callback,
      { fireImmediately: true }
    );

    return () => {
      unsubscribe();
    };
  }, [discoverSoundsState, directory]);
};

export default useDownloader;
