import Immutable from "@/interfaces/Immutable";
import axios from "axios";
import { useEffect, useState } from "react";

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
const dataError: IFetchDataError = {
  status: "fetchDataError",
};
class FetchDataSuccess<H> implements IFetchDataStatus {
  status = "fetchDataSuccess" as const;
  data: H;
  constructor(data: H) {
    this.data = data;
  }
}

const useFetchData = <T, K>(
  url: string,
  authToken?: string,
  onReceivedData?: (data: T) => K
): Immutable<IFetchDataState<T | K>> => {
  const [fetchDataState, setFetchDataState] =
    useState<IFetchDataState<T | K>>(fetchDataIdle);

  useEffect(() => {
    console.log(`Calling ${useFetchData.name} useEffect`);
    setFetchDataState(fetchDataLoading);
    const controller = new AbortController();
    const signal = controller.signal;

    axios
      .get<T>(url, {
        headers: authToken
          ? { Authorization: "Bearer " + authToken }
          : undefined,
        signal: signal,
      })
      .then((response) => {
        if (!signal.aborted) {
          const data = onReceivedData
            ? onReceivedData(response.data)
            : response.data;
          setFetchDataState(new FetchDataSuccess(data));
        }
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          console.log(error);
          setFetchDataState(dataError);
        }
      });

    return () => controller.abort();
  }, [onReceivedData, authToken, url]);

  return fetchDataState;
};

export default useFetchData;

export type {
  IFetchDataState,
  IFetchDataIdle,
  IFetchDataLoading,
  FetchDataSuccess,
  IFetchDataError,
};
