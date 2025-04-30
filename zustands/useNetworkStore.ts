import { create } from "zustand";

type INetworkState =
  | INetworkIdle
  | INetworkLoading
  | INetworkError
  | INetworkSuccess;

interface INetworkIdle {
  status: "networkIdle";
}

const networkIdle: INetworkIdle = {
  status: "networkIdle",
};

interface INetworkLoading {
  status: "networkLoading";
}

const networkLoading: INetworkLoading = {
  status: "networkLoading",
};

interface INetworkError {
  status: "networkError";
  error: string | null;
}

const networkError: INetworkError = {
  status: "networkError",
  error: null,
};

interface INetworkSuccess {
  status: "networkSuccess";
}

const networkSuccess: INetworkSuccess = {
  status: "networkSuccess",
};

interface INetworkStoreStates {
  networkState: INetworkState;
}

interface INetworkStoreActions {
  setNetworkState: (networkState: INetworkState) => void;
}

const useNetworkStore = create<INetworkStoreStates & INetworkStoreActions>(
  (set) => ({
    networkState: networkIdle,
    setNetworkState: (networkState: INetworkState) =>
      set(() => ({ networkState })),
  })
);

export default useNetworkStore;

export type {
  INetworkState,
  INetworkError,
  INetworkLoading,
  INetworkSuccess,
  INetworkIdle,
};

export { networkIdle, networkLoading, networkError, networkSuccess };
