import { AuthProvider } from "@/contexts/authContext";
import { EnvProvider } from "@/contexts/envContext";
import { FontsProvider } from "@/contexts/fontsContext";
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <EnvProvider>
      <FontsProvider>
        <AuthProvider>
          <Stack />
        </AuthProvider>
      </FontsProvider>
    </EnvProvider>
  );
};

export default RootLayout;
