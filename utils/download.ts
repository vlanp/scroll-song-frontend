import { IExcerptDownloadState } from "@/zustands/useDownloadStore";
import * as FileSystem from "expo-file-system";
import { DownloadProgressData } from "expo-file-system";

export const createDirectory = async (
  directory: string,
  setIsStorageError: (bool: boolean) => void
) => {
  try {
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
  } catch (e) {
    setIsStorageError(true);
    console.error(e);
  }
};

const _isFileExisting = async (fileName: string, directory?: string) => {
  const fileInfo = await FileSystem.getInfoAsync(
    FileSystem.documentDirectory +
      (directory ? directory + "/" : "") +
      fileName +
      ".mp3"
  );

  if (fileInfo.exists) {
    return true;
  }

  return false;
};

const _createDownloadResumable = (
  soundId: string,
  url: string,
  directory: string,
  setExcerptDownloadState: (
    soundId: string,
    updates: Partial<IExcerptDownloadState>
  ) => void
) => {
  const callback = (downloadProgress: DownloadProgressData) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setExcerptDownloadState(soundId, { relativeProgress: progress });
  };

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    FileSystem.documentDirectory +
      (directory ? directory + "/" : "") +
      soundId +
      ".mp3",
    {},
    callback
  );

  return downloadResumable;
};

export const download = async (
  soundId: string,
  soundUri: string,
  setExcerptDownloadState: (
    soundId: string,
    updates?: Partial<IExcerptDownloadState>
  ) => void,
  setIsStorageError: (bool: boolean) => void,
  directory?: string
) => {
  try {
    createDirectory(directory, setIsStorageError);

    if (await _isFileExisting(soundId, directory)) {
      return setExcerptDownloadState(soundId, {
        isLoaded: true,
        relativeProgress: 1,
      });
    }

    setExcerptDownloadState(soundId, {
      isLoading: true,
    });

    const downloadResumable = _createDownloadResumable(
      soundId,
      soundUri,
      directory,
      setExcerptDownloadState
    );

    const { uri } = await downloadResumable.downloadAsync();

    setExcerptDownloadState(soundId, { isLoaded: true, isLoading: false });

    console.log("Finished downloading to ", uri);
  } catch (e) {
    setExcerptDownloadState(soundId, { isError: true });
    console.error(e);
  }
};
