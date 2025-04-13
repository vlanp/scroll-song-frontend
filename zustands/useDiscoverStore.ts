import Immutable from "@/models/Immutable";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  fetchDataIdle,
  FetchDataSuccess,
  IFetchDataState,
} from "@/models/IFetchDataState";
import DiscoverSound from "@/models/DiscoverSound";
import { IDownloadSoundState } from "@/models/IDownloadSoundState";

interface IDiscoverStoreStates {
  downloadExcerptsState: Immutable<IDownloadExcerptsState>;
  fetchDiscoverSoundsState: Immutable<IFetchDataState<DiscoverSound[]>>;
  position: Immutable<SavedPosition>;
  isMainScrollEnable: boolean;
  likedTitleToDisplay: Immutable<TitleToDisplay> | null;
  dislikedTitleToDisplay: Immutable<TitleToDisplay> | null;
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
  setDownloadExcerptState: (
    soundId: ISoundId,
    downloadExcerptState: IDownloadSoundState
  ) => void;
  setFetchDiscoverSoundsState: (
    fetchDiscoverSoundsState: IFetchDataState<DiscoverSound[]>
  ) => void;
  removeDiscoverSound: (soundId: ISoundId) => void;
  setPosition: (position: Immutable<ReceivedPosition>) => void;
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

const removeDiscoverSound = (
  soundId: string,
  fetchDiscoverSoundsState: Immutable<IFetchDataState<DiscoverSound[]>>
): Immutable<IFetchDataState<DiscoverSound[]>> => {
  if (fetchDiscoverSoundsState.status !== "fetchDataSuccess") {
    throw new Error("Cannot remove sound when fetch is not successful");
  }
  return new FetchDataSuccess(
    fetchDiscoverSoundsState.data.filter((sound) => sound.id !== soundId)
  );
};

const setPosition = (
  prevPosition: Immutable<SavedPosition>,
  position: Immutable<ReceivedPosition>
): Immutable<SavedPosition> => {
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

export default useDiscoverStore;

export { ReceivedPosition, SavedPosition };
