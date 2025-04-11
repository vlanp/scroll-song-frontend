import Immutable from "@/models/Immutable";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { fetchDataIdle, IFetchDataState } from "./storeFetchDataState";
import DiscoverSound from "@/models/DiscoverSound";
import { IDownloadSoundState } from "./storeDownloadSoundState";

interface IDiscoverStoreStates {
  downloadExcerptsState: Immutable<IDownloadExcerptsState>;
  fetchDiscoverSoundsState: Immutable<IFetchDataState<DiscoverSound[]>>;
  position: Immutable<Position>;
  isMainScrollEnable: boolean;
  likedTitleToDisplay: Immutable<TitleToDisplay> | null;
  dislikedTitleToDisplay: Immutable<TitleToDisplay> | null;
}

type ISoundId = string;
type IDownloadExcerptsState = Record<ISoundId, IDownloadSoundState>;

class Position {
  currentPosition: number;
  isScrolling: boolean;
  constructor(currentPosition: number, isScrolling: boolean) {
    this.currentPosition = currentPosition;
    this.isScrolling = isScrolling;
  }
}

class TitleToDisplay {
  title: string;
  id: string;
  constructor(title: string, id: string) {
    this.title = title;
    this.id = id;
  }
}

interface IDiscoverStoreActions {
  setDownloadExcerptState: (
    soundId: ISoundId,
    downloadExcerptState: IDownloadSoundState
  ) => void;
  setFetchDiscoverSoundsState: (
    fetchDiscoverSoundsState: IFetchDataState<DiscoverSound[]>
  ) => void;
  setPosition: (position: Immutable<Position>) => void;
  setIsMainScrollEnable: (isMainScrollEnable: boolean) => void;
  setLikedTitleToDisplay: (
    likedTitleToDisplay: Immutable<TitleToDisplay> | null
  ) => void;
  setDislikedTitleToDisplay: (
    dislikedTitleToDisplay: Immutable<TitleToDisplay> | null
  ) => void;
}

const setDownloadExcerptState = (
  soundId: string,
  downloadExcerptsState: Immutable<IDownloadExcerptsState>,
  downloadExcerptState: Immutable<IDownloadSoundState>
): IDownloadExcerptsState => {
  return {
    ...downloadExcerptsState,
    [soundId]: downloadExcerptState,
  };
};

export const useDiscoverStore = create<
  IDiscoverStoreStates & IDiscoverStoreActions
>()(
  subscribeWithSelector((set) => ({
    downloadExcerptsState: {},
    setDownloadExcerptState: (
      soundId: ISoundId,
      downloadExcerptState: IDownloadSoundState
    ) =>
      set((state) =>
        setDownloadExcerptState(
          soundId,
          state.downloadExcerptsState,
          downloadExcerptState
        )
      ),
    fetchDiscoverSoundsState: fetchDataIdle,
    setFetchDiscoverSoundsState: (
      fetchDiscoverSoundsState: IFetchDataState<DiscoverSound[]>
    ) => set(() => ({ fetchDiscoverSoundsState: fetchDiscoverSoundsState })),
    position: new Position(0, false),
    setPosition: (position: Position) => set(() => ({ position })),
    isMainScrollEnable: true,
    setIsMainScrollEnable: (isMainScrollEnable: boolean) =>
      set(() => ({ isMainScrollEnable })),
    likedTitleToDisplay: null,
    setLikedTitleToDisplay: (likedTitleToDisplay: TitleToDisplay | null) =>
      set(() => ({ likedTitleToDisplay })),
    dislikedTitleToDisplay: null,
    setDislikedTitleToDisplay: (
      dislikedTitleToDisplay: TitleToDisplay | null
    ) => set(() => ({ dislikedTitleToDisplay })),
  }))
);
