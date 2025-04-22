import { useSuccessfulAuthContext } from "@/contexts/authContext";
import initDownloadExcerptsState from "@/zustands/initializer/initDownloadExcerptsState";
import initFetchDiscoverSoundsState from "@/zustands/initializer/initFetchDiscoverSoundsState";
import initNetworkState from "@/zustands/initializer/initNetworkState";
import useDiscoverStore from "@/zustands/useDiscoverStore";
import { ReactNode, useEffect } from "react";

const StoresInitializer = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const authState = useSuccessfulAuthContext();
  useEffect(() => {
    let abortController: AbortController | undefined;
    const unsubscribeDiscoverStore1 = useDiscoverStore.subscribe(
      (state) => state.retryDiscover,
      (retryDiscover) => {
        console.log("retryDiscover", retryDiscover);
        if (abortController) {
          abortController.abort();
        }
        abortController = initFetchDiscoverSoundsState(authState.authToken);
      },
      {
        fireImmediately: true,
      }
    );

    const unsubscribeDiscoverStore2 = initDownloadExcerptsState();

    const unsubsribeNetworkUpdate = initNetworkState();

    return () => {
      abortController?.abort();
      if (unsubscribeDiscoverStore1) {
        unsubscribeDiscoverStore1();
      }
      if (unsubscribeDiscoverStore2) {
        unsubscribeDiscoverStore2();
      }
      unsubsribeNetworkUpdate();
    };
  }, [authState.authToken]);

  return <>{children}</>;
};

export default StoresInitializer;
