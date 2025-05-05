import {
  fetchDataError,
  fetchDataLoading,
  FetchDataSuccess,
  IFetchDataState,
} from "../models/IFetchDataState";
import axios from "axios";

const storeFetchDataState = <T, K>(
  url: string,
  setFetchDataState: (fetchDataState: IFetchDataState<T | K>) => void,
  authToken?: string,
  onReceivedData?: (data: T) => K
): AbortController => {
  console.log(`Calling ${storeFetchDataState.name}`);
  setFetchDataState(fetchDataLoading);
  const controller = new AbortController();
  const signal = controller.signal;

  axios
    .get<T>(url, {
      headers: authToken ? { Authorization: "Bearer " + authToken } : undefined,
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

  return controller;
};

export default storeFetchDataState;
