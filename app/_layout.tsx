import { Slot, Tabs } from "expo-router";
import { NetworkProvider } from "../contexts/NetworkContext";
import { SoundsProvider } from "../contexts/SoundsContext";

const RootLayout = () => {
  return (
    <NetworkProvider>
      <SoundsProvider>
        <Tabs />
      </SoundsProvider>
    </NetworkProvider>
  );
};

export default RootLayout;
