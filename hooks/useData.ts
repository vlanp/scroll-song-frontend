import axios from "axios";
import { useEffect, useState } from "react";

const useData = <T, K = T>(
  url: string,
  authToken?: string,
  onReceivedData?: (data: T) => K
) => {
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | K | null>(null);

  useEffect(() => {
    console.log("Calling useData useEffect");
    setIsLoading(true);
    setError(null);
    setData(null);
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
          setData(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          console.log(error);
          setError(error);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [onReceivedData, authToken, url]);

  return { error, isLoading, data };
};

export default useData;
