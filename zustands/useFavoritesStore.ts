import SoundPlayer from "@/models/SoundPlayer";
import SoundPlayerState from "@/models/SoundPlayerState";
import { create } from "zustand";

type ISoundsPlayerState = Record<ISoundId, SoundPlayerState>;
type ISoundsPlayer = Record<ISoundId, SoundPlayer>;
type ISoundId = string;

interface IFavoritesStoreStates {
  updateTick: number;
  soundsPlayerState: ISoundsPlayerState;
  soundsPlayer: ISoundsPlayer;
}

interface IFavoritesStoreActions {
  setUpdateTick: () => void;
  setSoundPlayerState: (
    soundId: ISoundId,
    soundPlayerState: Partial<SoundPlayerState>
  ) => void;
  setSoundPlayer: (soundId: ISoundId, uri: string) => void;
}

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

const useFavoritesStore = create<
  IFavoritesStoreStates & IFavoritesStoreActions
>((set) => ({
  updateTick: 0,
  setUpdateTick: () => set((state) => ({ updateTick: state.updateTick + 1 })),
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
  soundsPlayer: {},
  setSoundPlayer: (soundId: ISoundId, uri: string): void =>
    set((state) => ({
      soundsPlayer: setSoundPlayer(
        soundId,
        state.soundsPlayer,
        uri,
        state.setSoundPlayerState,
        () => useFavoritesStore.getState().soundsPlayerState[soundId]
      ),
    })),
}));

export { useFavoritesStore };
