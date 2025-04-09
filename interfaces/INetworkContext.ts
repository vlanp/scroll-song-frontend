type INetwork =
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

export type {
  INetwork,
  INetworkError,
  INetworkLoading,
  INetworkSuccess,
  INetworkIdle,
};

export { networkIdle, networkLoading, networkError, networkSuccess };
