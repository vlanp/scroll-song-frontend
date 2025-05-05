import {
  fetchDataError,
  fetchDataIdle,
  fetchDataLoading,
  FetchDataSuccess,
  IFetchDataState,
} from "../models/IFetchDataState";
import axios from "axios";
import { useEffect, useState } from "react";

const useFetchDataState = <T, K = T>(
  url: string,
  refresh: number,
  authToken?: string,
  onReceivedData?: (data: T) => K
): IFetchDataState<T | K> => {
  const [fetchDataState, setFetchDataState] =
    useState<IFetchDataState<T | K>>(fetchDataIdle);

  useEffect(() => {
    console.log(`Calling ${useFetchDataState.name}`);
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
          setFetchDataState(fetchDataError);
        }
      });

    return () => controller.abort();
  }, [authToken, onReceivedData, url, refresh]);

  return fetchDataState;
};

export default useFetchDataState;
