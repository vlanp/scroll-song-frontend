import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface IPositionState {
  positionState: {
    currentPosition: number;
    isScrolling: boolean;
  };
}

interface IPositionAction {
  setPositionState: (currentPosition?: number, isScrolling?: boolean) => void;
}

const setPositionState = (
  positionState: IPositionState["positionState"],
  currentPosition?: number,
  isScrolling?: boolean
) => {
  return {
    positionState: {
      currentPosition:
        currentPosition !== undefined
          ? currentPosition
          : positionState.currentPosition,
      isScrolling: isScrolling ?? positionState.isScrolling,
    },
  };
};

interface IScrollState {
  isMainScrollEnable: boolean;
}

interface IScrollAction {
  setIsMainScrollEnable: (isMainScrollEnable: boolean) => void;
}

interface IDisplayTitleState {
  likedTitleToDisplay: {
    title: string;
    id: string;
  } | null;
  dislikedTitleToDisplay: {
    title: string;
    id: string;
  } | null;
}

interface IDisplayTitleAction {
  setLikedTitleToDisplay: (
    likedTitleToDisplay: IDisplayTitleState["likedTitleToDisplay"]
  ) => void;
  setDislikedTitleToDisplay: (
    dislikedTitleToDisplay: IDisplayTitleState["dislikedTitleToDisplay"]
  ) => void;
}

export const useDiscoverStore = create<
  IPositionState &
    IPositionAction &
    IScrollState &
    IScrollAction &
    IDisplayTitleState &
    IDisplayTitleAction
>()(
  subscribeWithSelector((set) => ({
    positionState: {
      currentPosition: 0,
      isScrolling: false,
    },
    setPositionState: (currentPosition?: number, isScrolling?: boolean) =>
      set((state) =>
        setPositionState(state.positionState, currentPosition, isScrolling)
      ),
    isMainScrollEnable: true,
    setIsMainScrollEnable: (isMainScrollEnable: boolean) =>
      set(() => ({ isMainScrollEnable: isMainScrollEnable })),
    likedTitleToDisplay: null,
    setLikedTitleToDisplay: (
      likedTitleToDisplay: IDisplayTitleState["likedTitleToDisplay"]
    ) => set(() => ({ likedTitleToDisplay: likedTitleToDisplay })),
    dislikedTitleToDisplay: null,
    setDislikedTitleToDisplay: (
      dislikedTitleToDisplay: IDisplayTitleState["dislikedTitleToDisplay"]
    ) => set(() => ({ dislikedTitleToDisplay: dislikedTitleToDisplay })),
  }))
);
