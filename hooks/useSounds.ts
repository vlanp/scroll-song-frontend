import { useEffect } from "react";
import useFetchData from "./useFetchData";
import handleReceivedData from "../utils/discover/handleReceivedData";
import useDownloader from "./useDownloader";
import { Audio } from "expo-av";
import { ISoundsState } from "@/models/ISoundsState";

const songsEndpoint = "/discover";
const excerptDirectory = "excerpt";

const useSounds = (): ISoundsState => {
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

  const discoverSoundsState = useFetchData(
    process.env.EXPO_PUBLIC_API_URL + songsEndpoint,
    "5a6251db-8f7e-4101-9577-3f5accfade3c",
    handleReceivedData
  );

  useDownloader(discoverSoundsState, excerptDirectory);

  return { isLoading, error, data, setDataState };
};

export default useSounds;
