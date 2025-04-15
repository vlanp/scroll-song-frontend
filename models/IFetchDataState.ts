import Immutable from "./Immutable";

interface IFetchDataStatus {
  status:
    | "fetchDataIdle"
    | "fetchDataLoading"
    | "fetchDataError"
    | "fetchDataSuccess";
}

type IFetchDataState<H> =
  | IFetchDataIdle
  | IFetchDataLoading
  | IFetchDataError
  | FetchDataSuccess<H>;

interface IFetchDataIdle extends IFetchDataStatus {
  status: "fetchDataIdle";
}
const fetchDataIdle: IFetchDataIdle = {
  status: "fetchDataIdle",
};
interface IFetchDataLoading extends IFetchDataStatus {
  status: "fetchDataLoading";
}
const fetchDataLoading: IFetchDataLoading = {
  status: "fetchDataLoading",
};
interface IFetchDataError extends IFetchDataStatus {
  status: "fetchDataError";
}
const fetchDataError: IFetchDataError = {
  status: "fetchDataError",
};
class FetchDataSuccess<H> implements IFetchDataStatus {
  status = "fetchDataSuccess" as const;
  data: H;
  constructor(data: H) {
    this.data = data;
  }
}

export type {
  IFetchDataState,
  IFetchDataIdle,
  IFetchDataLoading,
  IFetchDataError,
};

export { FetchDataSuccess };

export { fetchDataIdle, fetchDataLoading, fetchDataError };
