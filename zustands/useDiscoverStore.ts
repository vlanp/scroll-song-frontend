import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  fetchDataIdle,
  FetchDataSuccess,
  IFetchDataState,
} from "@/models/IFetchDataState";
import DiscoverSound from "@/models/DiscoverSound";
import { IDownloadSoundState } from "@/models/IDownloadSoundState";
import { FlatList } from "react-native";

interface IDiscoverStoreStates {
  retryDiscover: number;
  downloadExcerptsState: IDownloadExcerptsState;
  fetchDiscoverSoundsState: IFetchDataState<DiscoverSound[]>;
  position: SavedPosition;
  flatList: FlatList<DiscoverSound> | null;
  likedTitleToDisplay: TitleToDisplay | null;
  dislikedTitleToDisplay: TitleToDisplay | null;
}

type ISoundId = string;
type IDownloadExcerptsState = Record<ISoundId, IDownloadSoundState>;

class ReceivedPosition {
  currentPosition: number | "keepPosition";
  isScrolling: boolean | "keepScrollingState";
  constructor(
    currentPosition: number | "keepPosition",
    isScrolling: boolean | "keepScrollingState"
  ) {
    this.currentPosition = currentPosition;
    this.isScrolling = isScrolling;
  }
}

class SavedPosition {
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
  setRetryDiscover: () => void;
  setDownloadExcerptState: (
    soundId: ISoundId,
    downloadExcerptState: IDownloadSoundState
  ) => void;
  setFetchDiscoverSoundsState: (
    fetchDiscoverSoundsState: IFetchDataState<DiscoverSound[]>
  ) => void;
  removeDiscoverSound: (soundId: ISoundId) => void;
  setPosition: (position: ReceivedPosition) => void;
  setFlatList: (FlatList: FlatList<DiscoverSound> | null) => void;
  setIsFlatListScrollEnable: (isScrollEnable: boolean) => void;
  setLikedTitleToDisplay: (likedTitleToDisplay: TitleToDisplay | null) => void;
  setDislikedTitleToDisplay: (
    dislikedTitleToDisplay: TitleToDisplay | null
  ) => void;
}

const setIsFlatListScrollEnable = (
  isScrollEnable: boolean,
  flatList: FlatList<DiscoverSound> | null
) => {
  flatList?.setNativeProps({ scrollEnabled: isScrollEnable });
  return {};
};

const setDownloadExcerptState = (
  soundId: string,
  downloadExcerptsState: IDownloadExcerptsState,
  downloadExcerptState: IDownloadSoundState
): IDownloadExcerptsState => {
  return {
    ...downloadExcerptsState,
    [soundId]: downloadExcerptState,
  };
};

const removeDiscoverSound = (
  soundId: string,
  fetchDiscoverSoundsState: IFetchDataState<DiscoverSound[]>
): IFetchDataState<DiscoverSound[]> => {
  if (fetchDiscoverSoundsState.status !== "fetchDataSuccess") {
    throw new Error("Cannot remove sound when fetch is not successful");
  }
  return new FetchDataSuccess(
    fetchDiscoverSoundsState.data.filter((sound) => sound.id !== soundId)
  );
};

const setPosition = (
  prevPosition: SavedPosition,
  position: ReceivedPosition
): SavedPosition => {
  return new SavedPosition(
    position.currentPosition === "keepPosition"
      ? prevPosition.currentPosition
      : position.currentPosition,
    position.isScrolling === "keepScrollingState"
      ? prevPosition.isScrolling
      : position.isScrolling
  );
};

const useDiscoverStore = create<IDiscoverStoreStates & IDiscoverStoreActions>()(
  subscribeWithSelector((set) => ({
    retryDiscover: 0,
    setRetryDiscover: () =>
      set((state) => ({ retryDiscover: state.retryDiscover + 1 })),
    downloadExcerptsState: {},
    setDownloadExcerptState: (
      soundId: ISoundId,
      downloadExcerptState: IDownloadSoundState
    ) =>
      set((state) => ({
        downloadExcerptsState: setDownloadExcerptState(
          soundId,
          state.downloadExcerptsState,
          downloadExcerptState
        ),
      })),
    fetchDiscoverSoundsState: fetchDataIdle,
    setFetchDiscoverSoundsState: (
      fetchDiscoverSoundsState: IFetchDataState<DiscoverSound[]>
    ) => set(() => ({ fetchDiscoverSoundsState: fetchDiscoverSoundsState })),
    removeDiscoverSound: (soundId: ISoundId) =>
      set((state) => ({
        fetchDiscoverSoundsState: removeDiscoverSound(
          soundId,
          state.fetchDiscoverSoundsState
        ),
      })),
    position: new SavedPosition(0, false),
    setPosition: (position: ReceivedPosition) =>
      set((state) => ({ position: setPosition(state.position, position) })),
    flatList: null,
    setFlatList: (flatList: FlatList<DiscoverSound> | null) =>
      set(() => ({ flatList })),
    setIsFlatListScrollEnable: (isScrollEnable: boolean) =>
      set((state) => setIsFlatListScrollEnable(isScrollEnable, state.flatList)),
    likedTitleToDisplay: null,
    setLikedTitleToDisplay: (likedTitleToDisplay: TitleToDisplay | null) =>
      set(() => ({ likedTitleToDisplay })),
    dislikedTitleToDisplay: null,
    setDislikedTitleToDisplay: (
      dislikedTitleToDisplay: TitleToDisplay | null
    ) => set(() => ({ dislikedTitleToDisplay })),
  }))
);

export default useDiscoverStore;

export { ReceivedPosition, SavedPosition };
