import DiscoverSound from "../models/DiscoverSound";
import { IDownloadSoundState } from "../models/IDownloadSoundState";
import { IFetchDataState } from "../models/IFetchDataState";
import SoundPlayer from "../models/SoundPlayer";
import SoundPlayerState from "../models/SoundPlayerState";
import { FlatList } from "react-native";

interface IDiscoverStoreStates {
  retryDiscover: number;
  updateTick: number;
  soundsPlayer: ISoundsPlayer;
  soundsPlayerState: ISoundsPlayerState;
  downloadExcerptsState: IDownloadExcerptsState;
  fetchDiscoverSoundsState: IFetchDataState<DiscoverSound[]>;
  position: SavedPosition;
  flatList: FlatList<DiscoverSound> | null;
  likedTitleToDisplay: TitleToDisplay | null;
  dislikedTitleToDisplay: TitleToDisplay | null;
}

type ISoundId = string;
type IDownloadExcerptsState = Record<ISoundId, IDownloadSoundState>;
type ISoundsPlayer = Record<ISoundId, SoundPlayer>;
type ISoundsPlayerState = Record<ISoundId, SoundPlayerState>;

class ReceivedPosition {
  currentPosition: number | "keepPosition" | "resetPosition";
  isScrolling: boolean | "keepScrollingState" | "resetScrollingState";
  soundId: ISoundId | "keepSoundId" | "resetSoundId";
  constructor(
    currentPosition: number | "keepPosition" | "resetPosition",
    isScrolling: boolean | "keepScrollingState" | "resetScrollingState",
    soundId: ISoundId | "keepSoundId" | "resetSoundId"
  ) {
    this.currentPosition = currentPosition;
    this.isScrolling = isScrolling;
    this.soundId = soundId;
  }
}

class SavedPosition {
  currentPosition: number;
  isScrolling: boolean;
  soundId: ISoundId | null;
  constructor(
    currentPosition: number,
    isScrolling: boolean,
    soundId: ISoundId | null
  ) {
    this.currentPosition = currentPosition;
    this.isScrolling = isScrolling;
    this.soundId = soundId;
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

export { ReceivedPosition, SavedPosition, TitleToDisplay };

export type {
  IDiscoverStoreStates,
  ISoundId,
  IDownloadExcerptsState,
  ISoundsPlayer,
  ISoundsPlayerState,
};
