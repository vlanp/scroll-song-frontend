import { createContext, ReactNode } from "react";
import ISoundsContext from "../interfaces/ISoundsContext";
import useSounds from "../hooks/useSounds";

export const SoundsContext = createContext<ISoundsContext>(null);

//TODO Replace fixed auth token by a variable
export const SoundsProvider = ({ children }: { children: ReactNode }) => {
  const { data, error, isLoading } = useSounds();

  return (
    <SoundsContext.Provider
      value={{
        isLoading,
        error,
        data,
      }}
    >
      {children}
    </SoundsContext.Provider>
  );
};
