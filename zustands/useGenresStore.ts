import { create } from "zustand";

interface IGenresStoreStates {
  genresStates: Record<string, boolean>;
}

interface IGenresStoreActions {
  setGenreState: (genre: string, isSelected?: boolean | undefined) => void;
}

const setGenreState = (
  genre: string,
  genresStates: Record<string, boolean>,
  isSelected?: boolean | undefined
) => {
  const newSelectedState = isSelected || !genresStates[genre];
  return {
    ...genresStates,
    [genre]: newSelectedState,
  };
};

const useGenresStore = create<IGenresStoreStates & IGenresStoreActions>(
  (set) => ({
    genresStates: {},
    setGenreState: (genre: string, isSelected?: boolean | undefined) =>
      set((state) => ({
        genresStates: setGenreState(genre, state.genresStates, isSelected),
      })),
  })
);

export { useGenresStore };
