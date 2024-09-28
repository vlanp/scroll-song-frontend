import { create } from "zustand";

interface IPositionState {
  positionState: {
    currentPosition: number;
    isScrolling: boolean;
  };
}

interface IPositionAction {
  setPositionState: (currentPosition?: number, isScrolling?: boolean) => void;
}

interface IScrollState {
  isMainScrollEnable: boolean;
}

interface IScrollAction {
  setIsMainScrollEnable: (isMainScrollEnable: boolean) => void;
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

export const useDiscoverStore = create<
  IPositionState & IPositionAction & IScrollState & IScrollAction
>()((set) => ({
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
}));
