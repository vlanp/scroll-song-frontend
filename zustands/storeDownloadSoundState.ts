import downloadSound, { isFileExisting } from "../utils/download";
import getExcerptUri from "../utils/getExcerptUri";
import Immutable from "@/models/Immutable";
import ISound from "@/models/ISound";
import DiscoverSound from "@/models/DiscoverSound";
import { IDownloadSoundState } from "@/models/IDownloadSoundState";

const storeDownloadSoundState = async (
  sound: Immutable<ISound>,
  setDownloadSoundState: (
    soundId: string,
    downloadSoundState: IDownloadSoundState
  ) => void,
  setIsStorageOk: (isStorageOk: boolean) => void,
  directory: string
) => {
  if (await isFileExisting(sound.id, directory)) {
    return;
  }
  const excerptUri =
    sound instanceof DiscoverSound
      ? getExcerptUri(
          sound.audioUrl,
          sound.startTimeExcerptMs / 1000,
          sound.endTimeExcerptMs / 1000
        )
      : sound.audioUrl;

  downloadSound(
    sound.id,
    excerptUri,
    setDownloadSoundState,
    setIsStorageOk,
    directory
  );
};

export default storeDownloadSoundState;
