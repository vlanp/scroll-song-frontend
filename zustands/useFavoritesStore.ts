import { create } from "zustand";

interface IFavoritesStoreStates {
  updateTick: number;
}

interface IFavoritesStoreActions {
  setUpdateTick: () => void;
}

const useFavoritesStore = create<
  IFavoritesStoreStates & IFavoritesStoreActions
>((set) => ({
  updateTick: 0,
  setUpdateTick: () => set((state) => ({ updateTick: state.updateTick + 1 })),
}));

export { useFavoritesStore };
