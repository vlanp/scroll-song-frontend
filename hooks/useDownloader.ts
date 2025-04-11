import IDiscoverSound from "../models/DiscoverSound";
import useDownloadStore, {
  excerptDownloadIdle,
} from "../zustands/useDownloadStore";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { downloadSound } from "../utils/download";
import getExcerptUri from "../utils/getExcerptUri";
import { useDiscoverStore } from "../zustands/useDiscoverStore";
import { IFetchDataState } from "./useFetchData";
import Immutable from "@/models/Immutable";
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
  const lastDownloadIndex = useRef<number | null>(null);

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

      if ((lastDownloadIndex.current || 0) >= limit) {
        return;
      }

      // console.log("last download: ", lastDownload);

      for (let i = lastDownloadIndex.current || 0; i <= limit; i++) {
        const sound = discoverSoundsState[i];

        const excerptUri = getExcerptUri(
          sound.url,
          sound.start_time_excerpt_ms / 1000,
          sound.end_time_excerpt_ms / 1000
        );
        downloadSound(
          sound.id,
          excerptUri,
          setExcerptDownloadState.current,
          setIsStorageError.current,
          directory
        );
      }

      lastDownloadIndex.current = limit;
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
