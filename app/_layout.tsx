import { Slot } from "expo-router";
import { NetworkProvider } from "../contexts/NetworkContext";

const RootLayout = () => {
  return (
    <NetworkProvider>
      <Slot />
    </NetworkProvider>
  );
};

export default RootLayout;
