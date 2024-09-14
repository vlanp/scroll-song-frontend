import { useEffect, useRef, useState } from "react";
import IDownload from "../interfaces/IDownload";
import * as FileSystem from "expo-file-system";
import isFileExisting from "../utils/isFileExisting";

const useDownloader = ({
  uri,
  fileName,
  directory,
}: {
  uri: string;
  fileName: string;
  directory?: "excerpt" | "full";
}) => {
  const [downloadingState, setDownloadingState] = useState<IDownload>({
    isLoading: false,
    isLoaded: false,
    isError: false,
  });

  const [relativeProgress, setRelativeProgress] = useState<number>(0);

  const downloadResumable = useRef(null);

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

      const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        setRelativeProgress(progress);
      };

      downloadResumable.current = FileSystem.createDownloadResumable(
        uri,
        FileSystem.documentDirectory +
          (directory ? directory + "/" : "") +
          fileName,
        {},
        callback
      );

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

  useEffect(() => {
    download();
  }, []);

  return { downloadingState, relativeProgress };
};

export default useDownloader;
