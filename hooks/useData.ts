import axios from "axios";
import { useEffect, useState } from "react";

interface IDataState<H> {
  error: unknown;
  isLoading: boolean;
  data: H;
}

const useData = <T, K = T>(
  url: string,
  authToken?: string,
  onReceivedData?: (data: T) => K
) => {
  const [dataState, setDataState] = useState<IDataState<T | K | null>>({
    error: null,
    isLoading: true,
    data: null,
  });

  useEffect(() => {
    console.log("Calling useData useEffect");
    setDataState({
      error: null,
      isLoading: true,
      data: null,
    });
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
          setDataState((ds) => ({
            ...ds,
            isLoading: false,
            data,
          }));
        }
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          console.log(error);
          setDataState((ds) => ({
            ...ds,
            error,
            isLoading: false,
          }));
        }
      });

    return () => controller.abort();
  }, [onReceivedData, authToken, url]);

  return { ...dataState, setDataState };
};

export default useData;
