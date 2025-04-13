import { Immutable } from "immer";

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

export type { IDownloadSoundState };

export { DownloadSoundLoading, downloadSoundError, downloadSoundSuccess };
