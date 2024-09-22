import { create } from "zustand";
import IExcerptDownloadState from "../interfaces/IExcerptDownload";

interface IExcerptsDownloadState {
  excerptsDownloadState: {
    [soundId: string]: IExcerptDownloadState;
  };
}

export interface ISetExcerptDownloadState {
  (
    soundId: string,
    progress?: number,
    isLoading?: boolean,
    isLoaded?: boolean,
    isError?: boolean
  ): void;
}

interface IExcerptDownloadAction {
  setExcerptDownloadState: ISetExcerptDownloadState;
}

interface ICurrentPositionState {
  currentPosition: number;
}

interface ICurrentPositionAction {
  setCurrentPosition: (currentPosition: number) => void;
}

interface IStorageState {
  isStorageError: boolean;
}

interface IStorageAction {
  setIsStorageError: (bool: boolean) => void;
}

const setExcerptDownloadState = (
  soundId: string,
  excerptsDownload: IExcerptsDownloadState["excerptsDownloadState"],
  progress?: number,
  isLoading?: boolean,
  isLoaded?: boolean,
  isError?: boolean
) => {
  const existingDownload = excerptsDownload[soundId] || {
    isLoading: false,
    isLoaded: false,
    isError: false,
    relativeProgress: 0,
  };

  return {
    excerptsDownloadState: {
      ...excerptsDownload,
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
    ICurrentPositionState &
    ICurrentPositionAction &
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
  currentPosition: 0,
  setCurrentPosition: (currentPosition: number) =>
    set(() => ({ currentPosition: currentPosition })),
  isStorageError: false,
  setIsStorageError: (bool: boolean) => set(() => ({ isStorageError: bool })),
}));
