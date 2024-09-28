import { create } from "zustand";
import IExcerptDownloadState from "../interfaces/IExcerptDownload";

interface IExcerptsDownloadState {
  excerptsDownloadState: {
    [soundId: string]: IExcerptDownloadState;
  };
}

interface IExcerptDownloadAction {
  setExcerptDownloadState: (
    soundId: string,
    progress?: number,
    isLoading?: boolean,
    isLoaded?: boolean,
    isError?: boolean
  ) => void;
}

interface IStorageState {
  isStorageError: boolean;
}

interface IStorageAction {
  setIsStorageError: (bool: boolean) => void;
}

const setExcerptDownloadState = (
  soundId: string,
  excerptsDownloadState: IExcerptsDownloadState["excerptsDownloadState"],
  progress?: number,
  isLoading?: boolean,
  isLoaded?: boolean,
  isError?: boolean
) => {
  const existingDownload = excerptsDownloadState[soundId] || {
    isLoading: false,
    isLoaded: false,
    isError: false,
    relativeProgress: 0,
  };

  return {
    excerptsDownloadState: {
      ...excerptsDownloadState,
      [soundId]: {
        relativeProgress:
          progress !== undefined ? progress : existingDownload.relativeProgress,
        isLoading: isLoading ?? existingDownload.isLoading,
        isLoaded: isLoaded ?? existingDownload.isLoaded,
        isError: isError ?? existingDownload.isError,
      },
    },
  };
};

export const useDownloadStore = create<
  IExcerptsDownloadState &
    IExcerptDownloadAction &
    IStorageState &
    IStorageAction
>()((set) => ({
  excerptsDownloadState: {},
  setExcerptDownloadState: (
    soundId: string,
    progress?: number,
    isLoading?: boolean,
    isLoaded?: boolean,
    isError?: boolean
  ) =>
    set((state) =>
      setExcerptDownloadState(
        soundId,
        state.excerptsDownloadState,
        progress,
        isLoading,
        isLoaded,
        isError
      )
    ),
  isStorageError: false,
  setIsStorageError: (bool: boolean) => set(() => ({ isStorageError: bool })),
}));
