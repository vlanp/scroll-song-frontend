import {
  downloadSoundError,
  DownloadSoundLoading,
  downloadSoundSuccess,
  IDownloadSoundState,
} from "@/models/IDownloadSoundState";
import * as FileSystem from "expo-file-system";
import { DownloadProgressData } from "expo-file-system";

const createDirectory = async (
  directory: string,
  setIsStorageOk: (isStorageOk: boolean) => void
) => {
  try {
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
    setIsStorageOk(false);
    console.error(e);
  }
};

const isFileExisting = async (fileName: string, directory: string) => {
  const fileInfo = await FileSystem.getInfoAsync(
    FileSystem.documentDirectory + directory + "/" + fileName + ".mp3"
  );

  if (fileInfo.exists) {
    return true;
  }

  return false;
};

const createDownloadResumable = (
  soundId: string,
  url: string,
  directory: string,
  setDownloadSoundState: (
    soundId: string,
    downloadSoundState: IDownloadSoundState
  ) => void
) => {
  const callback = (downloadProgress: DownloadProgressData) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadSoundState(soundId, new DownloadSoundLoading(progress));
  };

  console.log(
    `${createDownloadResumable.name}: Create downloadResumable from ${url} to ${FileSystem.documentDirectory}${directory}/${soundId}.mp3`
  );

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    FileSystem.documentDirectory + directory + "/" + soundId + ".mp3",
    {},
    callback
  );

  return downloadResumable;
};

const downloadSound = async (
  soundId: string,
  soundUri: string,
  setDownloadSoundState: (
    soundId: string,
    downloadSoundState: IDownloadSoundState
  ) => void,
  setIsStorageOk: (isStorageOk: boolean) => void,
  directory: string
) => {
  try {
    createDirectory(directory, setIsStorageOk);

    if (await isFileExisting(soundId, directory)) {
      setDownloadSoundState(soundId, downloadSoundSuccess);
      console.warn(`${downloadSound.name}: File already exists`); // TODO: Replace by a retry in certain conditions ?
      return;
    }

    setDownloadSoundState(soundId, new DownloadSoundLoading(0));

    const downloadResumable = createDownloadResumable(
      soundId,
      soundUri,
      directory,
      setDownloadSoundState
    );

    const downloadResult = await downloadResumable.downloadAsync();
    const uri = downloadResult?.uri;

    setDownloadSoundState(soundId, downloadSoundSuccess);

    console.log("Finished downloading to ", uri);
  } catch (e) {
    setDownloadSoundState(soundId, downloadSoundError);
    console.error(e);
  }
};

export default downloadSound;
export { createDirectory, isFileExisting };
