import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { fetchDataIdle, IFetchDataState } from "../models/IFetchDataState";
import DiscoverSound from "../models/DiscoverSound";
import { IDownloadSoundState } from "../models/IDownloadSoundState";
import { FlatList } from "react-native";
import SoundPlayerState from "../models/SoundPlayerState";
import {
  IDiscoverStoreStates,
  ISoundId,
  ReceivedPosition,
  SavedPosition,
  TitleToDisplay,
} from "../models/IDiscoverStoreStates";
import {
  IDiscoverStoreActions,
  removeDiscoverSound,
  setDownloadExcerptState,
  setIsFlatListScrollEnable,
  setPosition,
  setSoundPlayer,
  setSoundPlayerState,
} from "../models/IDiscoverStoreActions";

const useDiscoverStore = create<IDiscoverStoreStates & IDiscoverStoreActions>()(
  subscribeWithSelector((set) => ({
    retryDiscover: 0,
    setRetryDiscover: () =>
      set((state) => ({ retryDiscover: state.retryDiscover + 1 })),
    updateTick: 0,
    setUpdateTick: () => set((state) => ({ updateTick: state.updateTick + 1 })),
    soundsPlayer: {},
    setSoundPlayer: (soundId: ISoundId, uri: string): void =>
      set((state) => ({
        soundsPlayer: setSoundPlayer(
          soundId,
          state.soundsPlayer,
          uri,
          state.setSoundPlayerState,
          () => useDiscoverStore.getState().soundsPlayerState[soundId]
        ),
      })),
    soundsPlayerState: {},
    setSoundPlayerState: (
      soundId: ISoundId,
      soundPlayerState: Partial<SoundPlayerState>
    ) =>
      set((state) => ({
        soundsPlayerState: setSoundPlayerState(
          soundId,
          state.soundsPlayerState,
          soundPlayerState
        ),
      })),
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
    position: new SavedPosition(0, false, null),
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
