import { createContext, ReactNode } from "react";
import { ISoundsState } from "../interfaces/ISoundsState";
import useSounds from "../hooks/useSounds";

export const SoundsContext = createContext<ISoundsState>(null);

//TODO Replace fixed auth token by a variable
export const SoundsProvider = ({ children }: { children: ReactNode }) => {
  const { data, error, isLoading, setDataState } = useSounds();

  return (
    <SoundsContext.Provider
      value={{
        isLoading,
        error,
        data,
        setDataState,
      }}
    >
      {children}
    </SoundsContext.Provider>
  );
};
