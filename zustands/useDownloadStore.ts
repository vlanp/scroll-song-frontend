import { create } from "zustand";

export interface IExcerptDownloadState {
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  relativeProgress: number;
}

interface IExcerptsDownloadState {
  excerptsDownloadState: {
    [soundId: string]: IExcerptDownloadState;
  };
}

interface IExcerptDownloadAction {
  setExcerptDownloadState: (
    soundId: string,
    updates?: Partial<IExcerptDownloadState>
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
  updates?: Partial<IExcerptDownloadState>
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
        ...existingDownload,
        ...updates,
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
    updates?: Partial<IExcerptDownloadState>
  ) =>
    set((state) =>
      setExcerptDownloadState(soundId, state.excerptsDownloadState, updates)
    ),
  isStorageError: false,
  setIsStorageError: (bool: boolean) => set(() => ({ isStorageError: bool })),
}));
