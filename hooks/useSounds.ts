import { useEffect } from "react";
import useData from "../hooks/useData";
import IDiscoverSound from "../interfaces/IDiscoverSound";
import handleReceivedData from "../utils/discover/handleReceivedData";
import { useDownloadStore } from "../zustands/useDownloadStore";
import useDownloader from "./useDownloader";

const songsEndpoint = "/discover";
const excerptDirectory = "excerpt";

const useSounds = () => {
  const { isLoading, error, data } = useData<IDiscoverSound[]>(
    process.env.EXPO_PUBLIC_API_URL + songsEndpoint,
    "5a6251db-8f7e-4101-9577-3f5accfade3c",
    handleReceivedData
  );

  useDownloader(isLoading, error, data, excerptDirectory);

  return { isLoading, error, data };
};

export default useSounds;
