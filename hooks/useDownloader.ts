import { useEffect, useRef, useState } from "react";
import IDownload from "../interfaces/IDownload";
import * as FileSystem from "expo-file-system";
import isFileExisting from "../utils/isFileExisting";

const useDownloader = ({
  uri,
  fileName,
}: {
  uri: string;
  fileName: string;
}) => {
  const [downloadingState, setDownloadingState] = useState<IDownload>({
    isLoading: false,
    isLoaded: false,
    isError: false,
  });

  const [relativeProgress, setRelativeProgress] = useState<number>(0);

  const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    console.log(progress);
    setRelativeProgress(progress);
  };

  const downloadResumable = useRef(
    FileSystem.createDownloadResumable(
      uri,
      FileSystem.documentDirectory + fileName,
      {},
      callback
    )
  );

  const download = async () => {
    try {
      if (await isFileExisting(fileName)) {
        setRelativeProgress(1);
        return setDownloadingState({ ...downloadingState, isLoaded: true });
      }
      setDownloadingState({ ...downloadingState, isLoading: true });
      const { uri } = await downloadResumable.current.downloadAsync();
      setDownloadingState({
        ...downloadingState,
        isLoading: false,
        isLoaded: true,
      });
      console.log("Finished downloading to ", uri);
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
