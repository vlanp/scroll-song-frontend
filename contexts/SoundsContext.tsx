import { createContext, ReactNode } from "react";
import useData from "../hooks/useData";
import IDiscoverSong from "../interfaces/IDiscoverSong";
import handleReceivedData from "../utils/discover/handleReceivedData";
import ISoundsContext from "../interfaces/ISoundsContext";

export const SoundsContext = createContext<ISoundsContext>(null);
const songsEndpoint = "/discover";

//TODO Replace fixed auth token by a variable
export const SoundsProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading, error, data, setData } = useData<IDiscoverSong[]>(
    process.env.EXPO_PUBLIC_API_URL + songsEndpoint,
    "5a6251db-8f7e-4101-9577-3f5accfade3c",
    handleReceivedData
  );

  return (
    <SoundsContext.Provider
      value={{
        isLoading,
        error,
        data,
        setData,
      }}
    >
      {children}
    </SoundsContext.Provider>
  );
};
