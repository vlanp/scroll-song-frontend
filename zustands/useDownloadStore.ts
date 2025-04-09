import Immutable from "@/interfaces/Immutable";
import { create } from "zustand";

type IExcerptDownloadState =
  | IExcerptDownloadIdle
  | IExcerptDownloadLoading
  | IExcerptDownloadError
  | Immutable<ExcerptDownloadSuccess>;

interface IExcerptDownloadIdle {
  status: "excerptDownloadIdle";
}
const excerptDownloadIdle: IExcerptDownloadIdle = {
  status: "excerptDownloadIdle",
};
interface IExcerptDownloadLoading {
  status: "excerptDownloadLoading";
}
const excerptDownloadLoading: IExcerptDownloadLoading = {
  status: "excerptDownloadLoading",
};
interface IExcerptDownloadError {
  status: "excerptDownloadError";
}
const excerptDownloadError: IExcerptDownloadError = {
  status: "excerptDownloadError",
};
class ExcerptDownloadSuccess {
  status = "excerptDownloadSuccess";
  relativeProgress: number;
  constructor(relativeProgress: number) {
    this.relativeProgress = relativeProgress;
  }
}

type soundId = string;

interface IExcerptsDownloadState {
  excerptsDownloadState: Record<soundId, Immutable<IExcerptDownloadState>>;
}

interface IExcerptDownloadAction {
  setExcerptDownloadState: (
    soundId: string,
    excerptDownloadState: Immutable<IExcerptDownloadState>
  ) => void;
}

const setExcerptDownloadState = (
  soundId: string,
  excerptsDownloadState: IExcerptsDownloadState["excerptsDownloadState"],
  excerptDownloadState: Immutable<IExcerptDownloadState>
): IExcerptsDownloadState => {
  return {
    excerptsDownloadState: {
      ...excerptsDownloadState,
      [soundId]: excerptDownloadState,
    },
  };
};

const useDownloadStore = create<
  IExcerptsDownloadState & IExcerptDownloadAction
>()((set) => ({
  excerptsDownloadState: {},
  setExcerptDownloadState: (
    soundId: string,
    excerptDownloadState: Immutable<IExcerptDownloadState>
  ) =>
    set((state) =>
      setExcerptDownloadState(
        soundId,
        state.excerptsDownloadState,
        excerptDownloadState
      )
    ),
}));

export default useDownloadStore;
export type {
  IExcerptDownloadState,
  IExcerptDownloadIdle,
  IExcerptDownloadLoading,
  IExcerptDownloadError,
  ExcerptDownloadSuccess,
  soundId,
};
export { excerptDownloadIdle, excerptDownloadLoading, excerptDownloadError };
