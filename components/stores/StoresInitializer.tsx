import initDownloadExcerptsState from "@/zustands/initializer/initDownloadExcerptsState";
import initFetchDiscoverSoundsState from "@/zustands/initializer/initFetchDiscoverSoundsState";
import initNetworkState from "@/zustands/initializer/initNetworkState";
import { ReactNode, useEffect } from "react";

const StoresInitializer = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  useEffect(() => {
    const abortController = initFetchDiscoverSoundsState();

    const unsubscribeDiscoverStore = initDownloadExcerptsState();

    const unsubsribeNetworkUpdate = initNetworkState();

    return () => {
      abortController?.abort();
      if (unsubscribeDiscoverStore) {
        unsubscribeDiscoverStore();
      }
      unsubsribeNetworkUpdate();
    };
  }, []);

  return <>{children}</>;
};

export default StoresInitializer;
