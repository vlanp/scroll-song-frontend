import * as FileSystem from "expo-file-system";
import { DownloadProgressData } from "expo-file-system";
import { ISetExcerptDownloadState } from "../zustands/useDownloadStore";

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
    FileSystem.documentDirectory + (directory ? directory + "/" : "") + fileName
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
  setExcerptDownloadState: ISetExcerptDownloadState
) => {
  const callback = (downloadProgress: DownloadProgressData) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setExcerptDownloadState(soundId, progress);
  };

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    FileSystem.documentDirectory + (directory ? directory + "/" : "") + soundId,
    {},
    callback
  );

  return downloadResumable;
};

export const download = async (
  soundId: string,
  soundUri: string,
  setExcerptDownloadState: ISetExcerptDownloadState,
  setIsStorageError: (bool: boolean) => void,
  directory?: string
) => {
  try {
    createDirectory(directory, setIsStorageError);

    if (await _isFileExisting(soundId, directory)) {
      return setExcerptDownloadState(soundId, 1, false, true, false);
    }

    setExcerptDownloadState(soundId, undefined, true);

    const downloadResumable = _createDownloadResumable(
      soundId,
      soundUri,
      directory,
      setExcerptDownloadState
    );

    const { uri } = await downloadResumable.downloadAsync();

    setExcerptDownloadState(soundId, undefined, false, true);

    console.log("Finished downloading to ", uri);
  } catch (e) {
    setExcerptDownloadState(soundId, undefined, undefined, undefined, true);
    console.error(e);
  }
};
