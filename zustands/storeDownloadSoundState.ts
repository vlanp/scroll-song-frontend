import downloadSound from "../utils/download";
import getExcerptUri from "../utils/getExcerptUri";
import Immutable from "@/models/Immutable";
import ISound from "@/models/ISound";
import DiscoverSound from "@/models/DiscoverSound";

interface IDownloadSoundStatus {
  status:
    | "downloadSoundLoading"
    | "downloadSoundError"
    | "downloadSoundSuccess";
}

type IDownloadSoundState =
  | Immutable<DownloadSoundLoading>
  | IDownloadSoundError
  | IDownloadSoundSuccess;

class DownloadSoundLoading implements IDownloadSoundStatus {
  status = "downloadSoundLoading" as const;
  relativeProgress: number;
  constructor(relativeProgress: number) {
    this.relativeProgress = relativeProgress;
  }
}
interface IDownloadSoundError extends IDownloadSoundStatus {
  status: "downloadSoundError";
}
const downloadSoundError: IDownloadSoundError = {
  status: "downloadSoundError",
};
interface IDownloadSoundSuccess extends IDownloadSoundStatus {
  status: "downloadSoundSuccess";
}
const downloadSoundSuccess: IDownloadSoundSuccess = {
  status: "downloadSoundSuccess",
};

const storeDownloadSoundState = (
  sound: Immutable<ISound>,
  setDownloadSoundState: (
    soundId: string,
    downloadSoundState: IDownloadSoundState
  ) => void,
  setIsStorageOk: (isStorageOk: boolean) => void,
  directory: string
) => {
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

export type { IDownloadSoundState };

export { DownloadSoundLoading, downloadSoundError, downloadSoundSuccess };
