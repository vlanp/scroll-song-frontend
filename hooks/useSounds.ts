import { useEffect } from "react";
import useData from "../hooks/useData";
import IDiscoverSound from "../interfaces/IDiscoverSound";
import handleReceivedData from "../utils/discover/handleReceivedData";
import useDownloader from "./useDownloader";
import { Audio } from "expo-av";

const songsEndpoint = "/discover";
const excerptDirectory = "excerpt";

const useSounds = () => {
  useEffect(() => {
    const initExpoAv = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        console.log("audiomodeasync enable");
      } catch (e) {
        console.log(e);
      }
    };

    initExpoAv();
  }, []);

  const { isLoading, error, data, setDataState } = useData<IDiscoverSound[]>(
    process.env.EXPO_PUBLIC_API_URL + songsEndpoint,
    "5a6251db-8f7e-4101-9577-3f5accfade3c",
    handleReceivedData
  );

  useDownloader(isLoading, error, data, excerptDirectory);

  return { isLoading, error, data, setDataState };
};

export default useSounds;
