import { useEffect, useRef, useState } from "react";
import IDownload from "../interfaces/IDownload";
import * as FileSystem from "expo-file-system";
import isFileExisting from "../utils/isFileExisting";
import IDiscoverSound, { IDiscoverSoundv2 } from "../interfaces/IDiscoverSound";

const useDownloader = ({
  isLoading,
  error,
  data,
  directory,
}: {
  isLoading: boolean;
  error: unknown;
  data: IDiscoverSound[];
  directory?: "excerpt" | "full";
}) => {
  const createInitialSounds = () => {
    return data.map((discoverSound, index): IDiscoverSoundv2 => {
      const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        setSounds((sounds) => {
          sounds[index].excerptDownload.relativeProgress = progress;
          return [...sounds];
        });
      };

      const downloadResumable = FileSystem.createDownloadResumable(
        discoverSound.url,
        FileSystem.documentDirectory +
          (directory ? directory + "/" : "") +
          discoverSound.id,
        {},
        callback
      );

      return {
        ...discoverSound,
        excerptDownload: {
          isError: false,
          isLoaded: false,
          isLoading: false,
          relativeProgress: 0,
          downloadResumable,
        },
      };
    });
  };

  const [sounds, setSounds] = useState<IDiscoverSoundv2[]>(null);

  const createDirectory = async () => {
    if (!directory) {
      return;
    }
    const info = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + directory
    );
    if (info.exists) {
      return;
    }
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + directory
    );
  };

  const download = async () => {
    try {
      await createDirectory();

      if (await isFileExisting(fileName, directory)) {
        setRelativeProgress(1);
        return setDownloadingState({ ...downloadingState, isLoaded: true });
      }

      setDownloadingState({ ...downloadingState, isLoading: true });
      const { uri: _uri } = await downloadResumable.current.downloadAsync();
      setDownloadingState({
        ...downloadingState,
        isLoading: false,
        isLoaded: true,
      });
      console.log("Finished downloading to ", _uri);
    } catch (e) {
      setDownloadingState({ ...downloadingState, isError: true });
      console.error(e);
    }
  };

  const deleteFile = async () => {
    try {
      const didFileExist = (
        await FileSystem.getInfoAsync(
          FileSystem.documentDirectory +
            (directory ? directory + "/" : "") +
            fileName
        )
      ).exists;
      if (!didFileExist) {
        return;
      }
      await FileSystem.deleteAsync(
        FileSystem.documentDirectory +
          (directory ? directory + "/" : "") +
          fileName
      );
      setDownloadingState({
        isLoading: false,
        isLoaded: false,
        isError: false,
      });
      setRelativeProgress(0);
    } catch (e) {
      setDownloadingState({ ...downloadingState, isError: true });
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isLoading && !error && data) {
      const initialSounds = createInitialSounds();
      setSounds(initialSounds);
    }
  }, [isLoading, error, data]);

  const retry = () => {
    setDownloadingState({
      isLoading: false,
      isLoaded: false,
      isError: false,
    });
    download();
  };

  return { downloadingState, relativeProgress, retry, deleteFile };
};

export default useDownloader;
