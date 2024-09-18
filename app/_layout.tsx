import { Slot } from "expo-router";
import { NetworkProvider } from "../contexts/NetworkContext";
import { SoundsProvider } from "../contexts/SoundsContext";

const RootLayout = () => {
  return (
    <NetworkProvider>
      <SoundsProvider>
        <Slot />
      </SoundsProvider>
    </NetworkProvider>
  );
};

export default RootLayout;
