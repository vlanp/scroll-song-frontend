import SoundPlayerState from "@/models/SoundPlayerState";
import {
  IDownloadExcerptsState,
  ISoundId,
  ISoundsPlayer,
  ISoundsPlayerState,
  ReceivedPosition,
  SavedPosition,
  TitleToDisplay,
} from "./IDiscoverStoreStates";
import { IDownloadSoundState } from "@/models/IDownloadSoundState";
import { FetchDataSuccess, IFetchDataState } from "@/models/IFetchDataState";
import DiscoverSound from "@/models/DiscoverSound";
import { FlatList } from "react-native";
import SoundPlayer from "@/models/SoundPlayer";

interface IDiscoverStoreActions {
  setRetryDiscover: () => void;
  setUpdateTick: () => void;
  setSoundPlayer: (soundId: ISoundId, uri: string) => void;
  setSoundPlayerState: (
    soundId: ISoundId,
    soundPlayerState: Partial<SoundPlayerState>
  ) => void;
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

const setSoundPlayer = (
  soundId: string,
  soundsPlayer: ISoundsPlayer,
  uri: string,
  setSoundPlayerState: (
    soundId: ISoundId,
    soundPlayerState: Partial<SoundPlayerState>
  ) => void,
  getSoundPlayerState: () => SoundPlayerState
): ISoundsPlayer => {
  if (soundsPlayer[soundId]) {
    return soundsPlayer;
  }
  return {
    ...soundsPlayer,
    [soundId]: new SoundPlayer(
      uri,
      soundId,
      setSoundPlayerState,
      getSoundPlayerState
    ),
  };
};

const setSoundPlayerState = (
  soundId: string,
  soundsPlayerState: ISoundsPlayerState,
  soundPlayerState: Partial<SoundPlayerState>
): ISoundsPlayerState => {
  return {
    ...soundsPlayerState,
    [soundId]: {
      ...soundsPlayerState[soundId],
      ...soundPlayerState,
    },
  };
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
      : position.isScrolling,
    position.soundId === "keepSoundId" ? prevPosition.soundId : position.soundId
  );
};

export type { IDiscoverStoreActions };

export {
  setIsFlatListScrollEnable,
  setSoundPlayer,
  setSoundPlayerState,
  setDownloadExcerptState,
  removeDiscoverSound,
  setPosition,
};
