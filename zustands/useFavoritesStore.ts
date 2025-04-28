import SoundPlayerState from "@/models/SoundPlayerState";
import { create } from "zustand";

type ISoundsPlayerState = Record<ISoundId, SoundPlayerState>;
type ISoundId = string;

interface IFavoritesStoreStates {
  updateTick: number;
  soundsPlayerState: ISoundsPlayerState;
}

interface IFavoritesStoreActions {
  setUpdateTick: () => void;
  setSoundPlayerState: (
    soundId: ISoundId,
    soundPlayerState: Partial<SoundPlayerState>
  ) => void;
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
}));

export { useFavoritesStore };
